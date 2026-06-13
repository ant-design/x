import $ from 'dekko';

$('lib').isDirectory().hasFile('index.js').hasFile('index.d.ts');

$('es').isDirectory().hasFile('index.js').hasFile('index.d.ts');

$('dist').isDirectory().hasFile('x-card.js').hasFile('x-card.min.js');
