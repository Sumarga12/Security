// models/Appointment.js
const mongoose = require('mongoose');
const crypto = require('crypto');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceName: { type: String, required: true },
  serviceId: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Confirmed', 'Completed', 'Cancelled', 'Pending'],
    default: 'Pending'
  },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  message: { type: String },
  totalPrice: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  }
}, { timestamps: true });

// Encryption helpers
function encrypt(text) {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.DATA_ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(text);
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
  return decrypted.toString();
}
// Encrypt sensitive fields before save
appointmentSchema.pre('save', function (next) {
  if (this.isModified('customerPhone') && this.customerPhone) {
    this.customerPhone = encrypt(this.customerPhone);
  }
  if (this.isModified('customerEmail') && this.customerEmail) {
    this.customerEmail = encrypt(this.customerEmail);
  }
  next();
});
// Decrypt sensitive fields on read
appointmentSchema.methods.getDecryptedCustomerPhone = function () {
  return decrypt(this.customerPhone);
};
appointmentSchema.methods.getDecryptedCustomerEmail = function () {
  return decrypt(this.customerEmail);
};

module.exports = mongoose.model('Appointment', appointmentSchema); 