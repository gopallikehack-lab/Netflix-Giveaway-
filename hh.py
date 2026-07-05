import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, CommandHandler, CallbackQueryHandler,
    PreCheckoutQueryHandler, MessageHandler, filters,
    ContextTypes
)

# ===== CONFIGURATION =====
BOT_TOKEN = "8890665171:AAHys6nL_29-nhyeoDz8tQA74p_ZjaZR1vc"  # Replace with your bot token

# Star packages (price in Stars)
PACKAGES = {
    "10": {"label": "⭐ 10 Stars", "price": 10},
    "50": {"label": "⭐ 50 Stars", "price": 50},
    "100": {"label": "⭐ 100 Stars", "price": 100},
}

# Temporary storage for user choices (in production use a DB)
user_choices = {}

# ===== START COMMAND =====
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton(pkg["label"], callback_data=f"buy_{amt}")]
        for amt, pkg in PACKAGES.items()
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "🌟 *Send Stars to a Friend!*\n\n"
        "Choose a package below, then enter the recipient's username (e.g., @username) or ID.",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )

# ===== PACKAGE SELECTION =====
async def package_selected(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    amount = query.data.split("_")[1]  # e.g., "buy_10" → "10"
    user_choices[query.from_user.id] = {"amount": amount}
    await query.edit_message_text(
        f"✅ You selected *{PACKAGES[amount]['label']}*.\n\n"
        "Now send me the recipient's **username** (with @) or **ID**.\n"
        "Example: @friend or 123456789",
        parse_mode="Markdown"
    )

# ===== RECIPIENT INPUT =====
async def handle_recipient(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if user_id not in user_choices:
        await update.message.reply_text("Please start over with /start.")
        return

    recipient_input = update.message.text.strip()
    # Remove '@' if present
    recipient = recipient_input.lstrip('@')
    amount = user_choices[user_id]["amount"]
    price = PACKAGES[amount]["price"]

    # Build invoice
    title = f"Send {PACKAGES[amount]['label']} to {recipient}"
    description = f"You are sending {amount} Stars to @{recipient}."
    payload = f"stars_{amount}_{recipient}_{user_id}"
    provider_token = ""  # For Stars, this can be empty
    currency = "XTR"  # Telegram Stars
    prices = [{"label": f"{PACKAGES[amount]['label']} for {recipient}", "amount": price}]

    await update.message.reply_invoice(
        title=title,
        description=description,
        payload=payload,
        provider_token=provider_token,
        currency=currency,
        prices=prices,
        start_parameter="send_stars",
        need_name=False,
        need_phone_number=False,
        need_email=False,
        need_shipping_address=False,
        is_flexible=False,
    )

# ===== PRE-CHECKOUT (validate) =====
async def pre_checkout(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.pre_checkout_query
    # You can add extra validation here
    await query.answer(ok=True)

# ===== SUCCESSFUL PAYMENT =====
async def successful_payment(update: Update, context: ContextTypes.DEFAULT_TYPE):
    payment = update.message.successful_payment
    payload = payment.invoice_payload  # contains: stars_{amount}_{recipient}_{sender_id}
    parts = payload.split("_")
    if len(parts) >= 4:
        amount = parts[1]
        recipient = parts[2]
        sender_id = int(parts[3])

    msg = (
        f"✅ *Payment Successful!*\n\n"
        f"You sent *{amount} Stars* to *@{recipient}*.\n"
        f"Thank you! 🎉"
    )
    await update.message.reply_text(msg, parse_mode="Markdown")

    # Notify the recipient (if known)
    try:
        await context.bot.send_message(
            chat_id=recipient if recipient.isdigit() else f"@{recipient}",
            text=f"🎁 You received *{amount} Stars* from a friend!\n\n"
                 f"Check your Stars balance in the app. 🌟",
            parse_mode="Markdown"
        )
    except Exception:
        # Recipient may not exist or bot can't message them
        await update.message.reply_text(
            f"⚠️ Could not notify @{recipient}. They might not have started the bot."
        )

    # Clean up user choice
    if sender_id in user_choices:
        del user_choices[sender_id]

# ===== MAIN =====
def main():
    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(package_selected, pattern="^buy_"))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_recipient))
    app.add_handler(PreCheckoutQueryHandler(pre_checkout))
    app.add_handler(MessageHandler(filters.SUCCESSFUL_PAYMENT, successful_payment))

    print("🤖 Bot is running...")
    app.run_polling()

if __name__ == "__main__":
    main()
