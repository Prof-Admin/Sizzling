import axios from 'axios';

export async function saveOrder(payload) {
  try {
    await axios.post('/api/orders', payload);
  } catch (err) {
    console.error('Order DB save failed:', err);
    // Silent fail — WhatsApp message was already sent
  }
}
