// models/Payment.js
const mongoose = require('mongoose');
const crypto = require('crypto');

const paymentSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['Visa / MasterCard', 'PayPal', 'eSewa', 'Khalti'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  transactionId: { type: String },
  paymentDetails: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

// Encryption helpers
function encrypt(text) {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.DATA_ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(JSON.stringify(text));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}
function decrypt(text) {
  if (!text) return text;
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.DATA_ENCRYPTION_KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString());
}
// Encrypt paymentDetails before save
paymentSchema.pre('save', function (next) {
  if (this.isModified('paymentDetails') && this.paymentDetails) {
    this.paymentDetails = encrypt(this.paymentDetails);
  }
  next();
});
// Decrypt paymentDetails on read
paymentSchema.methods.getDecryptedPaymentDetails = function () {
  return decrypt(this.paymentDetails);
};

module.exports = mongoose.model('Payment', paymentSchema); 