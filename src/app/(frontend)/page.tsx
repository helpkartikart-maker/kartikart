import { existsSync } from 'node:fs'
import { join } from 'node:path'
import Link from 'next/link'
import {
  ArrowRight,
  BedDouble,
  Car,
  Landmark,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  UtensilsCrossed,
} from 'lucide-react'
import { getFeaturedPackages, getFeaturedStories, getSiteSettings } from '@/lib/queries'
import { buildWhatsappLink, generalEnquiryMessage } from '@/lib/whatsapp'
import { PackageCard } from '@/components/packages/PackageCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Reveal } from '@/components/ui/Reveal'
import { LandingIntro } from '@/components/landing/LandingIntro'
import styles from './home.module.css'

const STAGES = [
  { icon: Car, label: 'Taxi', text: 'Our own fleet picks you up — clean cars, drivers who know the roads.' },
  { icon: BedDouble, label: 'Hotel', text: 'Kartikart-owned stays and handpicked partner hotels in Deoghar.' },
  { icon: UtensilsCrossed, label: 'Khana', text: 'The famous Deoghar prasad thali and heritage food trails.' },
  { icon: Landmark, label: 'Heritage', text: 'Baidyanath Dham darshan and the stories woven around it.' },
]

const POINTS = [
  { icon: Car, title: 'Comfortable taxis', text: 'Own fleet, AC cars, verified drivers.' },
  { icon: BedDouble, title: 'Premium stays', text: 'Owned hotels plus trusted local partners.' },
  { icon: UtensilsCrossed, title: 'Best food', text: 'Prasad thali and heritage food trails.' },
  { icon: Landmark, title: 'Heritage first', text: 'Deoghar darshan, done the right way.' },
  { icon: ShieldCheck, title: 'One partner', text: 'One number accountable for the whole trip.' },
  { icon: MapPin, title: 'Pan-India ready', text: 'From Deoghar-local to all-India tours.' },
]

export default async function HomePage() {
  const [settings, packages, stories] = await Promise.all([
    getSiteSettings(),
    getFeaturedPackages(6),
    getFeaturedStories(3),
  ])
  const wa = buildWhatsappLink({
    whatsappNumber: settings.whatsappNumber,
    message: generalEnquiryMessage(),
  })
  const hasHeroPhoto = existsSync(join(process.cwd(), 'public', 'brand', 'hero-temple.jpg'))

  return (
    <main>
      <LandingIntro />
      {/* ---------- HERO: Deoghar dawn ---------- */}
      <section className={styles.hero} data-photo={hasHeroPhoto ? 'true' : 'false'}>
        {hasHeroPhoto ? (
          <>
            <div className={styles.heroPhoto} aria-hidden />
            <div className={styles.heroTint} aria-hidden />
          </>
        ) : null}
        <div className={styles.sun} aria-hidden />
        <div className={`kk-container ${styles.heroInner}`}>
          <span className={styles.heroEyebrow}>Deoghar · Baba Baidyanath Dham</span>
          <h1 className={styles.heroTitle}>
            Taxi se Hotel tak,
            <br />
            Khana se Heritage tak
          </h1>
          <p className={styles.heroSub}>{settings.heroSubline || 'Sab Kuch Best, Sirf Aapke Liye.'}</p>
          <p className={styles.heroLead}>
            Ek hi haath mein poori yatra — cab, stay, khaana aur heritage. Deoghar se shuru, poore
            India ke liye.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/packages" className="kk-btn kk-btn--saffron">
              Explore packages <ArrowRight size={18} />
            </Link>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="kk-btn kk-btn--ghost-light">
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>
          <ul className={styles.heroTrust}>
            <li>
              <Car size={16} /> 5 own cars
            </li>
            <li>
              <BedDouble size={16} /> Own + partner hotels
            </li>
            <li>
              <MapPin size={16} /> Deoghar-rooted
            </li>
          </ul>
        </div>

        <svg
          className={styles.skyline}
          viewBox="0 0 1440 260"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden
        >
          <path
            fill="#0b1e44"
            d="M0,150 C220,120 360,170 560,158 C760,146 900,104 1120,140 C1280,166 1380,146 1440,138 L1440,260 L0,260 Z"
          />
          <path fill="#0b1e44" d="M604,168 a30,34 0 0 1 60,0 Z" />
          <path fill="#0b1e44" d="M780,168 a26,30 0 0 1 52,0 Z" />
          <g fill="#0b1e44">
            <path d="M688,158 C688,112 702,74 720,36 C738,74 752,112 752,158 Z" />
            <rect x="680" y="156" width="80" height="16" rx="3" />
            <circle cx="720" cy="30" r="7" />
            <rect x="718.5" y="6" width="3" height="18" />
          </g>
          <path d="M721,7 l20,6 l-20,6 Z" fill="#f7941e" />
        </svg>
      </section>

      {/* ---------- THE JOURNEY THREAD (signature) ---------- */}
      <section className={`kk-section ${styles.journey}`}>
        <div className="kk-container">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="The Kartikart Way"
              title="One thread through your whole journey"
              intro="Taxi se Hotel tak, Khana se Heritage tak — we hold every step, so you just travel."
            />
          </Reveal>
          <div className={styles.thread}>
            <div className={styles.threadLine} aria-hidden />
            {STAGES.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className={styles.stageWrap}>
                <div className={styles.stage}>
                  <div className={styles.stageNode}>
                    <s.icon size={26} strokeWidth={1.75} />
                    <span className={styles.stageNum}>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className={styles.stageLabel}>{s.label}</h3>
                  <p className={styles.stageText}>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FEATURED PACKAGES ---------- */}
      <section className={`kk-section ${styles.packages}`}>
        <div className="kk-container">
          <div className={styles.sectionTop}>
            <SectionHeading eyebrow="Featured Journeys" title="Handcrafted trips, ready to go" />
            <Link href="/packages" className={styles.viewAll}>
              View all packages <ArrowRight size={16} />
            </Link>
          </div>
          {packages.length ? (
            <div className={styles.grid}>
              {packages.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <PackageCard pkg={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Featured journeys are being planned — check back soon.</p>
          )}
        </div>
      </section>

      {/* ---------- WHY KARTIKART ---------- */}
      <section className={styles.why}>
        <div className="kk-container">
          <div className={styles.whyGrid}>
            <Reveal className={styles.whyIntro}>
              <SectionHeading
                light
                eyebrow="Why Kartikart"
                title="Owned, not outsourced"
                intro="Most agencies rebook your cab and stay through middlemen. We own ours — so quality and price stay in our hands."
              />
              <div className={styles.stats}>
                <div>
                  <strong>5</strong>
                  <span>cars in our own fleet</span>
                </div>
                <div>
                  <strong>2</strong>
                  <span>Kartikart-owned hotels</span>
                </div>
                <div>
                  <strong>1</strong>
                  <span>partner for the whole trip</span>
                </div>
              </div>
            </Reveal>
            <div className={styles.whyPoints}>
              {POINTS.map((p, i) => (
                <Reveal key={p.title} delay={i * 60}>
                  <div className={styles.point}>
                    <span className={styles.pointIcon}>
                      <p.icon size={20} strokeWidth={1.9} />
                    </span>
                    <div>
                      <h4>{p.title}</h4>
                      <p>{p.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- STORIES ---------- */}
      <section className={`kk-section ${styles.stories}`}>
        <div className="kk-container">
          <Reveal>
            <SectionHeading light align="center" eyebrow="Yaadgaar Safar" title="Stories from our travellers" />
          </Reveal>
          {stories.length ? (
            <div className={styles.storyGrid}>
              {stories.map((s, i) => (
                <Reveal key={s.id} delay={i * 80}>
                  <figure className={styles.story}>
                    <div className={styles.stars} aria-label={`${s.rating ?? 5} out of 5`}>
                      {Array.from({ length: s.rating ?? 5 }).map((_, k) => (
                        <Star key={k} size={15} fill="currentColor" strokeWidth={0} />
                      ))}
                    </div>
                    <blockquote>“{s.quote}”</blockquote>
                    <figcaption>
                      <strong>{s.customerName}</strong>
                      {s.tripLabel ? <span>{s.tripLabel}</span> : null}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className={styles.emptyLight}>Traveller stories are coming soon.</p>
          )}
        </div>
      </section>

      {/* ---------- CLOSING CTA ---------- */}
      <section className={styles.cta}>
        <div className="kk-container">
          <Reveal>
            <div className={styles.ctaCard}>
              <span className="kk-eyebrow kk-eyebrow--light">Nayi jagah, naya swad, nayi yaadein</span>
              <h2 className={styles.ctaTitle}>Build your trip, get a WhatsApp quote in a tap.</h2>
              <p>Add packages to your trip and send us one message — no forms, no waiting.</p>
              <div className={styles.heroCtas}>
                <Link href="/packages" className="kk-btn kk-btn--saffron">
                  Start your trip <ArrowRight size={18} />
                </Link>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="kk-btn kk-btn--ghost-light">
                  <MessageCircle size={18} /> Ask on WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
