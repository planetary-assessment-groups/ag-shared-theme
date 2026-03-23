CMS.registerEditorComponent({
  id: 'highlight',
  label: 'Highlight Box',
  icon: 'quote',
  fields: [
    { name: 'body', label: 'Content', widget: 'markdown' },
  ],
  pattern: /\{%\s*highlight\(\)\s*%\}([\s\S]*?)\{%\s*end\s*%\}/,
  fromBlock: (match) => ({ body: (match[1] || '').trim() }),
  toBlock: ({ body }) => `{% highlight() %}\n${body || ''}\n{% end %}`,
  toPreview: ({ body }) =>
    `<div style="border:1px solid #cecece;background:#fde9c4;padding:1em;margin-bottom:1.5em">${body || ''}</div>`,
});

CMS.registerEditorComponent({
  id: 'image-card',
  label: 'Image Card',
  icon: 'image',
  fields: [
    { name: 'src', label: 'Image', widget: 'image' },
    { name: 'alt', label: 'Alt Text', widget: 'string' },
    { name: 'link', label: 'Link URL', widget: 'string', required: false },
    { name: 'label', label: 'Label', widget: 'string', required: false },
    {
      name: 'size',
      label: 'Size',
      widget: 'select',
      default: 'medium',
      options: ['small', 'medium', 'large', 'half', 'full'],
    },
    {
      name: 'align',
      label: 'Alignment',
      widget: 'select',
      default: 'left',
      options: ['left', 'center', 'right'],
    },
  ],
  pattern: /\{\{\s*image_card\(([^)]*)\)\s*\}\}/,
  fromBlock: (match) => {
    const str = match[1] || '';
    const get = (key) => {
      const m = str.match(new RegExp(`${key}="([^"]*)"`));
      return m ? m[1] : '';
    };
    return {
      src: get('src'),
      alt: get('alt'),
      link: get('link'),
      label: get('label'),
      size: get('size') || 'medium',
      align: get('align') || 'left',
    };
  },
  toBlock: ({ src, alt, link, label, size, align }) => {
    let params = `src="${src || ''}"`;
    if (alt) params += `, alt="${alt}"`;
    if (link) params += `, link="${link}"`;
    if (label) params += `, label="${label}"`;
    if (size && size !== 'medium') params += `, size="${size}"`;
    if (align && align !== 'left') params += `, align="${align}"`;
    return `{{ image_card(${params}) }}`;
  },
  toPreview: ({ src, alt, label, size }) => {
    const widths = {
      small: '80px',
      medium: '120px',
      large: '160px',
      half: '200px',
      full: '100%',
    };
    const w = widths[size] || '120px';
    return `<div style="display:inline-block;width:${w};text-align:center;margin:0.5em">
       <img src="${src || ''}" alt="${alt || ''}" style="width:100%;border-radius:12px;border:3px solid #fff">
       ${label ? `<p><strong>${label}</strong></p>` : ''}
     </div>`;
  },
});
