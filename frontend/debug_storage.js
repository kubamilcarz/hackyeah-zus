// Open browser dev tools and run this in console to see localStorage data
console.log('=== ZUS App LocalStorage Debug ===');
Object.keys(localStorage).filter(key => key.startsWith('zus-')).forEach(key => {
  console.log(`${key}:`, JSON.parse(localStorage.getItem(key) || '{}'));
});
