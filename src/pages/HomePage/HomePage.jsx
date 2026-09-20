import { useState } from 'react'
import { Link } from 'react-router-dom'
import HeroBar from '../../components/HeroBar/HeroBar'
import CaseInProgressDialog from '../../components/CaseInProgressDialog/CaseInProgressDialog'
import ContactDialog from '../../components/ContactDialog/ContactDialog'
import balatyIllustration from '../../assets/balaty-illustration.png'
import halykMarketCover from '../../assets/halyk-market-cover.png'
import dcbCover from '../../assets/dcb-cover.png'
import './HomePage.css'

function IconToggle({ open }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }}
    >
      <path
        d="M2.925 2.922C6.821 -0.974 13.171 -0.974 17.067 2.922C20.970 6.825 20.963 13.168 17.067 17.064C17.067 17.064 16.867 17.259 16.867 17.259C12.950 20.966 6.762 20.901 2.925 17.064C-0.971 13.168 -0.978 6.825 2.925 2.922ZM6.601 9.243C6.187 9.244 5.851 9.579 5.851 9.993C5.851 10.407 6.187 10.743 6.601 10.743C6.601 10.743 9.242 10.743 9.242 10.743C9.242 10.743 9.242 13.382 9.242 13.382C9.243 13.795 9.579 14.131 9.992 14.132C10.406 14.132 10.742 13.796 10.742 13.382C10.742 13.382 10.742 10.743 10.742 10.743C10.742 10.743 13.384 10.744 13.384 10.744C13.798 10.744 14.134 10.408 14.134 9.994C14.134 9.580 13.798 9.244 13.384 9.244C13.384 9.244 10.742 9.243 10.742 9.243C10.742 9.243 10.742 6.605 10.742 6.605C10.742 6.191 10.407 5.855 9.992 5.855C9.578 5.855 9.242 6.191 9.242 6.605C9.242 6.605 9.242 9.243 9.242 9.243C9.242 9.243 6.601 9.243 6.601 9.243Z"
        fillRule="evenodd"
        fill="#F29559"
      />
    </svg>
  )
}

const WORKS = [
  {
    id: 'halyk-market',
    title: 'Halyk Market',
    role: 'Product Design Lead',
    desc: 'Growing GMV and NPS with a team, processes, and a design system I built over last 2 years',
    cover: halykMarketCover,
  },
  {
    id: 'dcb-seller',
    title: 'DCB Seller',
    role: 'Senior Product Designer',
    desc: 'Designed MVP of a seller cabinet and admin panel of DCB Marketplace that sped up core operations',
    cover: dcbCover,
  },
]

const REVIEWS = [
  {
    id: 'glen',
    name: 'Glen Katsai',
    rolePrefix: 'Product manager',
    company: 'PLATA',
    companyUrl: 'https://bancoplata.mx/en',
    paragraphs: [
      'I had the pleasure of working with Almaz at Halyk Market, where he led a team of 4 designers responsible for the entire customer-facing product experience: from storefront and discovery to checkout and order flows.',
      'I highly recommend Almaz as a design leader. He is already capable of owning the design strategy for a large and complex product end-to-end: building the team, managing it, setting the direction, and delivering results. What I particularly valued in working with Almaz was that we could discuss product goals at a high level without me having to dive into design execution details. I could trust him as a manager to take ownership of the problem and figure out how his team should solve it.',
      'Over our 2 years working together, Almaz and his team completely redesigned the marketplace\'s customer-facing experience. I think this also says something important about his approach: Almaz is someone you can build with for the long term. He can take a broad vision, systematically turn it into reality, and keep the team moving toward it over time.',
      'I would gladly work with Almaz again and recommend him to anyone looking for a design leader who can take full ownership of a major product area.',
    ],
  },
  {
    id: 'ilyas',
    name: 'Ilyas Bazarov',
    rolePrefix: 'Product manager',
    company: 'Ozon Bank',
    companyUrl: 'https://finance.ozon.ru/',
    paragraphs: [
      'I\'ve had the pleasure of working closely with Almaz for over four years across various projects and workplaces, and I would want him on every team I lead moving forward. Almaz is a responsible professional with outstanding communication skills, easily finding common ground with people at all levels.',
      'He was a valuable team member who grew quickly and often went beyond "just design." Throughout our collaboration, Almaz demonstrated significant professional growth and took initiative in solving complex problems. His thoughtful approach not only enhances user experience but also adds a unique style and refined taste to the product – both within digital channels and the overall brand, which he understands deeply.',
      'Almaz doesn\'t just complete tasks effectively – he actively seeks new opportunities to improve processes and outcomes. His initiative and genuine passion for his work have made him an indispensable team member.',
      'I recommend Almaz without hesitation for any company and am confident that his professionalism and talent will make him a valuable asset to any project.',
    ],
  },
  {
    id: 'ismar',
    name: 'Ismar Dzhon',
    rolePrefix: 'Head of Design',
    company: '360.tech',
    companyUrl: null,
    paragraphs: [
      'Almaz is one of the most talented product designers I\'ve had the pleasure of working with. He possesses not only technical expertise in creating design systems but also exceptional communication skills, enabling effective collaboration with development teams and product managers.',
      'His systematic approach and ability to see the big picture have helped us optimize processes and improve our products\' quality. Almaz consistently finds ways to make design not only visually appealing but also highly functional – an essential quality in modern IT.',
      'One of his key achievements was building a design system for the bank\'s ecosystem, which became the foundation for many of our products and significantly streamlined their development. His talent for solving complex problems and uncovering new optimization opportunities makes him an invaluable asset to any team.',
    ],
  },
]

const BEYOND = [
  {
    id: 'doscredobank',
    title: 'Doscredobank · 2022',
    desc: "Refreshed the bank's brand identity to reflect its digital transformation",
    tile: 'placeholder',
  },
  {
    id: 'emergency-exit',
    title: 'Emergency Exit · 2018',
    desc: "Created a site-specific art installation in Chișinău, Moldova, raising awareness of challenges facing local children's library",
    tile: 'placeholder',
  },
  {
    id: 'balaty',
    href: '/work/balaty',
    title: 'Balaty · 2016',
    desc: 'Conceived and art-directed a charity sticker pack',
    award: '🏆 Gold, Craft: Illustration & 3D – Jolbors International Festival of Creativity',
    tile: 'image',
  },
  {
    id: 'object-1',
    title: 'Object #1 · 2012',
    desc: 'Shot a documentary photo series about children growing up in orphanages',
    award: '🏆 Best Documentary Photo Series – Investigate Real Life grant program',
    tile: 'placeholder',
  },
]

export default function HomePage() {
  const [openReview, setOpenReview] = useState(null)
  const [caseDialogOpen, setCaseDialogOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)

  function toggleReview(id) {
    setOpenReview(prev => prev === id ? null : id)
  }

  return (
    <div className="home-page">
      <HeroBar onContactClick={() => setContactDialogOpen(true)} />

      <main className="home-page__main">
        {/* Intro */}
        <p className="home-page__intro">
          My design expertise and experience building creative teams and design practices
          enable me to drive impact at every level – from hands-on execution and mentoring
          designers to shaping product direction and scaling design operations
        </p>

        {/* Work cards */}
        <section className="works">
          {WORKS.map(w => (
            <button
              key={w.id}
              type="button"
              className="work-card"
              onClick={() => setCaseDialogOpen(true)}
            >
              <img className="work-card__tile" src={w.cover} alt={`${w.title} cover`} />
              <span className="work-card__info">
                <span className="work-card__title-row">
                  <span className="work-card__project">{w.title}</span>
                  <span className="work-card__rule" aria-hidden="true" />
                  <span className="work-card__role">{w.role}</span>
                </span>
                <span className="work-card__desc">{w.desc}</span>
              </span>
            </button>
          ))}
        </section>

        {/* Reviews */}
        <section className="reviews">
          <div className="reviews__heading">
            <h2 className="reviews__title">Reviews from colleagues</h2>
          </div>
          <ul className="reviews__list">
            {REVIEWS.map(r => (
              <li key={r.id} className="review-item">
                <button
                  className="review-item__header"
                  onClick={() => toggleReview(r.id)}
                  aria-expanded={openReview === r.id}
                >
                  <div className="review-item__meta">
                    <span className="review-item__name">{r.name}</span>
                    <span className="review-item__role">
                      {r.rolePrefix},{' '}
                      {r.companyUrl
                        ? <a href={r.companyUrl} target="_blank" rel="noopener noreferrer" className="review-item__company-link">{r.company}</a>
                        : r.company}
                    </span>
                  </div>
                  <IconToggle open={openReview === r.id} />
                </button>
                <div className={`review-item__body-wrapper${openReview === r.id ? ' review-item__body-wrapper--open' : ''}`}>
                  <div className="review-item__body">
                    {r.paragraphs.map((p, i) => (
                      <p key={i} className="review-item__para">{p}</p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Beyond product design */}
        <section className="beyond">
          <div className="beyond__heading">
            <h2 className="beyond__title">Beyond product design</h2>
          </div>
          <ul className="beyond__list">
            {BEYOND.map(item => {
              const Item = item.href ? Link : 'div'
              return (
                <li key={item.id}>
                  <Item className="beyond-item" {...(item.href && { to: item.href })}>
                    {item.tile === 'image'
                      ? (
                        <img
                          className="beyond-item__tile beyond-item__tile--image"
                          src={balatyIllustration}
                          alt=""
                        />
                      )
                      : (
                        <div className="beyond-item__tile beyond-item__tile--placeholder">
                          <span>case</span>
                          <span>in progress</span>
                        </div>
                      )}
                    <div className="beyond-item__info">
                      <div className="beyond-item__top">
                        <span className="beyond-item__title">{item.title}</span>
                        <p className="beyond-item__desc">{item.desc}</p>
                      </div>
                      {item.award && <p className="beyond-item__award">{item.award}</p>}
                    </div>
                  </Item>
                </li>
              )
            })}
          </ul>
        </section>
      </main>

      <CaseInProgressDialog open={caseDialogOpen} onClose={() => setCaseDialogOpen(false)} />
      <ContactDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        title="Let's talk"
        description="Whether it's work, a collaboration, or a quick question – I'm one message away"
      />
    </div>
  )
}
