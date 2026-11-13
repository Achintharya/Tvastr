import { Link } from 'react-router-dom'

import { useDocumentHead } from '../../hooks/useDocumentHead'

export function BuyerProductPage({ product }) {
  useDocumentHead(`${product.title} | Tvastr`, product.description, `https://tvastr.co${product.route}`)
  return <div id="presentation-root" className="pt-20" style={{background:'#ffffff',color:'#111827'}}>
    <section className="presentation-slide">
      <div className="max-w-[900px] mx-auto px-6 md:px-8 py-16 md:py-20 w-full">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-6">{product.tag}</p>
        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">{product.title}</h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-[680px]">{product.description}</p>
        <p className="text-sm text-slate-500 mt-6">{product.audience}</p>
      </div>
    </section>
    <BuyerSection label="Your team's work" title={product.heading} body={product.body} bullets={product.capabilities}/>
    <BuyerSection label="In everyday use" title="A practical place to start" bullets={product.steps}/>
    <BuyerSection label="The Tvastr product family" title="Choose what your team needs" body={product.relationship}>
      <div className="flex flex-wrap gap-5 mt-8 text-sm text-slate-600 underline underline-offset-4">
        <Link to="/products/medhas">Medhas</Link><Link to="/products/piras">PIRAS</Link><Link to="/products/executive-mis-cortex">Executive MIS</Link><Link to="/products/vajra-cortex">Vajra Cortex</Link>
      </div>
    </BuyerSection>
    <BuyerSection title={product.id === 'vajra-cortex' ? 'Talk about Vajra Cortex' : 'See how it fits your plant'} body="Tell us about your team and the information you work with. We can walk through the product with your needs in mind.">
      <Link to="/#contact" className="inline-flex px-6 py-3 rounded-full bg-gray-900 text-white text-sm">{product.id === 'vajra-cortex' ? 'Discuss Vajra Cortex' : 'Request a demo'}</Link>
      <Link to="/technology" className="inline-flex ml-6 py-3 text-sm underline underline-offset-4 text-slate-600">Explore the technology</Link>
    </BuyerSection>
  </div>
}

function BuyerSection({label,title,body,bullets,children}){return <section className="border-t border-gray-200"><div className="max-w-[900px] mx-auto px-6 md:px-8 py-16 md:py-20">{label&&<p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-4">{label}</p>}<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 leading-tight">{title}</h2>{body&&<p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 max-w-[720px]">{body}</p>}{bullets&&<ul className="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed">{bullets.map(t=><li key={t}>{t}</li>)}</ul>}{children}</div></section>}
