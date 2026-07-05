import { getPayload } from 'payload'
import config from '@/payload.config'
import { buildWhatsappLink, packageEnquiryMessage } from '@/lib/whatsapp'
import './styles.css'

const regionLabel = (r?: string | null) => (r === 'pan-india' ? 'Pan-India' : 'Deoghar & Local')

export default async function HomePage() {
  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const { docs: featured } = await payload.find({
    collection: 'packages',
    where: { and: [{ status: { equals: 'published' } }, { featured: { equals: true } }] },
    limit: 6,
    sort: '-createdAt',
  })

  const wa = settings.whatsappNumber || '916201234567'

  return (
    <>
      <header className="kk-topbar">
        <div className="kk-brand">
          <span className="kk-brand-mark">K</span>
          <span className="kk-brand-name">Kartikart</span>
        </div>
        <span className="kk-brand-tag">{settings.brandTagline}</span>
      </header>

      <section className="kk-hero">
        <p className="kk-eyebrow">Tour &amp; Travel Agency · Deoghar, Jharkhand</p>
        <h1 className="kk-hero-title">{settings.heroHeadline}</h1>
        <p className="kk-hero-sub">{settings.heroSubline}</p>
        <a
          className="kk-btn kk-btn-wa"
          href={buildWhatsappLink({
            whatsappNumber: wa,
            message: settings.whatsappDefaultMessage || 'Hi Kartikart! I would like to plan a trip.',
          })}
          target="_blank"
          rel="noopener noreferrer"
        >
          Plan my trip on WhatsApp
        </a>
      </section>

      <section className="kk-section">
        <h2 className="kk-section-title">Featured Journeys</h2>
        {featured.length === 0 ? (
          <p className="kk-empty">
            No featured journeys yet — mark a package “featured” in the admin panel.
          </p>
        ) : (
          <ul className="kk-grid">
            {featured.map((pkg) => (
              <li key={pkg.id} className="kk-card">
                <div className="kk-card-body">
                  <span className="kk-chip">{regionLabel(pkg.region)}</span>
                  <h3 className="kk-card-title">{pkg.title}</h3>
                  {pkg.shortPitch ? <p className="kk-card-pitch">{pkg.shortPitch}</p> : null}
                  <div className="kk-card-meta">
                    {pkg.durationNights && pkg.durationDays ? (
                      <span>
                        {pkg.durationNights}N / {pkg.durationDays}D
                      </span>
                    ) : null}
                    {pkg.priceFrom ? <span>From ₹{pkg.priceFrom.toLocaleString('en-IN')}</span> : null}
                  </div>
                </div>
                <a
                  className="kk-btn kk-btn-wa kk-card-cta"
                  href={buildWhatsappLink({
                    whatsappNumber: wa,
                    message: packageEnquiryMessage({
                      title: pkg.title,
                      region: regionLabel(pkg.region),
                      durationNights: pkg.durationNights,
                      durationDays: pkg.durationDays,
                    }),
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book on WhatsApp
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="kk-footer">
        <div className="kk-footer-brand">
          Kartikart <span>Tour &amp; Travel</span>
        </div>
        <div className="kk-footer-contact">
          {settings.phone ? <span>📞 {settings.phone}</span> : null}
          <a
            href={buildWhatsappLink({ whatsappNumber: wa, message: 'Hi Kartikart!' })}
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 WhatsApp
          </a>
          {settings.instagram ? <span>📷 {settings.instagram}</span> : null}
          {settings.address ? <span>📍 {settings.address}</span> : null}
        </div>
        <p className="kk-footer-note">Phase 1 preview · full interactive site coming in Phase 2</p>
      </footer>
    </>
  )
}
