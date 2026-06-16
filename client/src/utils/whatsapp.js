import { MENU_SECTIONS as DEFAULT_MENU_SECTIONS, FS_MENU as DEFAULT_FS_MENU, FS_PACKAGES } from '../context/OrderContext';

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '447435405324';

function fmt(n) {
  return `£${n.toFixed(2)}`;
}

export function openWhatsApp(text) {
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
}

export function buildGrazingMessage(state, computed, menuSections = DEFAULT_MENU_SECTIONS) {
  const {
    style, guestTier, primaryColor, accentColor, menuItems, addedPackages,
    setupTime, staffCount, staffHours, kitchenStatus, accessNotes, details,
  } = state;
  const { total } = computed;

  const menuLines = [];
  for (const [id, qty] of Object.entries(menuItems)) {
    for (const section of menuSections) {
      const item = section.items.find(i => i.id === id);
      if (item) {
        menuLines.push(`  • ${item.name} × ${qty} — ${fmt(item.price * qty)}`);
        break;
      }
    }
  }

  const brunchLines = addedPackages.map(p => `  • ${p.name} — ${fmt(p.price)}`);
  const dietaryList = details.dietary.length
    ? details.dietary.map(d => d.replace(/-/g, ' ')).join(', ')
    : 'None';

  const lines = [
    `🍽️ *NEW GRAZING TABLE ORDER — Sizzling Sensations*`,
    ``,
    `📋 *Service*: Grazing Table`,
    style ? `🎨 *Style*: ${style.name}` : null,
    `👥 *Guests*: ${guestTier?.guests ?? '—'} (${guestTier?.label ?? '—'} tier)`,
    primaryColor ? `🎨 *Colours*: ${primaryColor.name} & ${accentColor?.name ?? '—'}` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `📞 *CONTACT DETAILS*`,
    `Name: ${details.name}`,
    `Email: ${details.email}`,
    `Phone: ${details.phone}`,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `📅 *EVENT DETAILS*`,
    `Type: ${details.eventType}`,
    details.eventDate ? `Date: ${details.eventDate}` : null,
    details.startTime ? `Time: ${details.startTime}` : null,
    details.venue ? `Venue: ${details.venue}` : null,
    details.deliveryTime ? `Delivery Time: ${details.deliveryTime}` : null,
    details.occasionNotes ? `Notes: ${details.occasionNotes}` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `🍴 *MENU SELECTIONS*`,
    menuLines.length ? menuLines.join('\n') : `  None selected`,
    brunchLines.length ? `\n🎁 *BRUNCH PACKAGES*\n${brunchLines.join('\n')}` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `⚙️ *LOGISTICS*`,
    `Setup Time: ${setupTime}`,
    `Kitchen Access: ${kitchenStatus ?? 'Not specified'}`,
    `Staff: ${staffCount} staff × ${staffHours}hrs`,
    accessNotes ? `Access Notes: ${accessNotes}` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `🥗 *DIETARY & ALLERGIES*`,
    `Requirements: ${dietaryList}`,
    details.allergyDetails ? `Details: ${details.allergyDetails}` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `💰 *ESTIMATED TOTAL: ${fmt(total)}* (incl. 20% VAT)`,
  ];

  return lines.filter(l => l !== null).join('\n');
}

export function buildPlatterMessage(state, computed) {
  const {
    platterFulfillment, platterGuests, platterDate,
    platterAddress, platterSpecialInstructions, platterBasket, platterContact,
  } = state;
  const { platterSubtotal, platterFee, platterTotal } = computed;

  const itemLines = platterBasket.map(
    item => `  • ${item.name}${item.detail ? ` (${item.detail})` : ''} — ${fmt(item.price)}`
  );

  const lines = [
    `📦 *NEW PLATTER ORDER — Sizzling Sensations*`,
    ``,
    `🚚 *Fulfilment*: ${platterFulfillment === 'delivery' ? 'Delivery' : 'Collection'}`,
    `👥 *Guests*: ${platterGuests}`,
    platterDate ? `📅 *Date*: ${platterDate}` : null,
    platterFulfillment === 'delivery' && platterAddress ? `📍 *Address*: ${platterAddress}` : null,
    platterSpecialInstructions ? `📝 *Instructions*: ${platterSpecialInstructions}` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `📞 *CONTACT DETAILS*`,
    `Name: ${platterContact.name}`,
    `Email: ${platterContact.email}`,
    `Phone: ${platterContact.phone}`,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `🛒 *ITEMS ORDERED*`,
    itemLines.length ? itemLines.join('\n') : `  No items`,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `💰 *PRICE BREAKDOWN*`,
    `Subtotal: ${fmt(platterSubtotal)}`,
    `Service Fee (5%): ${fmt(platterFee)}`,
    `*TOTAL: ${fmt(platterTotal)}*`,
  ];

  return lines.filter(l => l !== null).join('\n');
}

export function buildFullServiceMessage(state, computed, fsMenu = DEFAULT_FS_MENU) {
  const { fsPackage, fsGuests, fsSelectedItems, fsDetails } = state;
  const { fsPkg, fsTotal } = computed;

  const resolve = (category, id) => {
    const item = fsMenu[category]?.items.find(i => i.id === id);
    return item ? item.name : id;
  };

  const starterNames = (fsSelectedItems.starters || []).map(id => resolve('starters', id));
  const mainNames = (fsSelectedItems.mains || []).map(id => resolve('mains', id));
  const dessertNames = (fsSelectedItems.desserts || []).map(id => resolve('desserts', id));

  const menuLines = [];
  if (starterNames.length) menuLines.push(`  Starters: ${starterNames.join(', ')}`);
  if (mainNames.length) menuLines.push(`  Mains: ${mainNames.join(', ')}`);
  if (dessertNames.length) menuLines.push(`  Desserts: ${dessertNames.join(', ')}`);

  const lines = [
    `⭐ *NEW FULL-SERVICE ORDER — Sizzling Sensations*`,
    ``,
    `📦 *Package*: ${fsPkg?.name ?? fsPackage} — £${fsPkg?.pricePerGuest ?? '—'}/guest`,
    `👥 *Guests*: ${fsGuests}`,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `📞 *CONTACT DETAILS*`,
    `Name: ${fsDetails.name}`,
    `Email: ${fsDetails.email}`,
    `Phone: ${fsDetails.phone}`,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `📅 *EVENT DETAILS*`,
    `Type: ${fsDetails.eventType}`,
    fsDetails.eventDate ? `Date: ${fsDetails.eventDate}` : null,
    fsDetails.startTime ? `Time: ${fsDetails.startTime}` : null,
    fsDetails.venue ? `Venue: ${fsDetails.venue}` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `🍽️ *MENU SELECTIONS*`,
    menuLines.length ? menuLines.join('\n') : `  No items selected`,
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `🥗 *DIETARY & ALLERGIES*`,
    fsDetails.dietary || 'None specified',
    ``,
    `━━━━━━━━━━━━━━━━━━`,
    `💰 *ESTIMATED TOTAL: £${fsTotal.toLocaleString('en-GB', { minimumFractionDigits: 2 })}*`,
  ];

  return lines.filter(l => l !== null).join('\n');
}
