import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BannerAboutUs from '../../layouts/BannerAboutUs/BannerAboutUs';
import aboutImg1 from '../../assets/images/aboutus/aboutus_1.jpeg';
import aboutImg2 from '../../assets/images/aboutus/aboutus_2.jpeg';
import aboutImg3 from '../../assets/images/aboutus/aboutus_3.jpg';
import aboutImg4 from '../../assets/images/aboutus/aboutus_4.jpg';
import './AboutUsDetail.scss';

function useScrollReveal(threshold = 0.12) {
  const refs = useRef([]);
  const states = useRef([]);
  const [tick, setTick] = useState(0);

  const register = useCallback(
    index => el => {
      refs.current[index] = el;
      states.current[index] = states.current[index] ?? false;
    },
    [],
  );

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        let changed = false;
        entries.forEach(entry => {
          const idx = refs.current.indexOf(entry.target);
          if (idx !== -1 && entry.isIntersecting && !states.current[idx]) {
            states.current[idx] = true;
            obs.unobserve(entry.target);
            changed = true;
          }
        });
        if (changed) setTick(t => t + 1);
      },
      { threshold },
    );

    refs.current.forEach(el => {
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [threshold]);

  const isVisible = useCallback(index => states.current[index] ?? false, [tick]);
  return { register, isVisible };
}

const AboutUsDetail = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { register, isVisible } = useScrollReveal(0.12);

  const values = useMemo(
    () => [
      { n: '01', titleKey: 'aboutUsPage.value1Title', descKey: 'aboutUsPage.value1Desc' },
      { n: '02', titleKey: 'aboutUsPage.value2Title', descKey: 'aboutUsPage.value2Desc' },
      { n: '03', titleKey: 'aboutUsPage.value3Title', descKey: 'aboutUsPage.value3Desc' },
    ],
    [],
  );

  return (
    <div className="ap">
      <div className="ap-scroll-mask" aria-hidden="true" />

      <BannerAboutUs />

      {/* ══════════  INTRO  ══════════ */}
      <section className={`ap-intro ${isVisible(0) ? 'on' : ''}`} ref={register(0)}>
        <div className="ap-intro__quote">
          <span className="big-quote" aria-hidden="true">
            &ldquo;
          </span>
          <p>{t('aboutUsPage.introQuote')}</p>
        </div>
        <div className="ap-intro__meta" aria-label="Brand facts">
          <span>Est. 2020</span>
          <span aria-hidden="true">·</span>
          <span>Handmade</span>
          <span aria-hidden="true">·</span>
          <span>Premium Yarns</span>
        </div>
      </section>

      {/* ══════════  STORY  ══════════ */}
      <section className={`ap-story ${isVisible(1) ? 'on' : ''}`} ref={register(1)}>
        <div className="ap-story__img-col">
          <img
            src={aboutImg3}
            alt="Cindy crocheting"
            className="ap-story__img-tall"
            loading="lazy"
            decoding="async"
          />
          <div className="ap-story__tag">
            <span>Made by hand</span>
          </div>
        </div>

        <div className="ap-story__text-col">
          <p className="ap-story__eyebrow">{t('aboutUsPage.storyEyebrow')}</p>
          <h2 className="ap-story__h2">{t('aboutUs.title')}</h2>
          <p className="ap-story__p">{t('aboutUs.paragraph1')}</p>
          <p className="ap-story__p">{t('aboutUs.paragraph2')}</p>

          <img
            src={aboutImg1}
            alt="Premium yarns"
            className="ap-story__img-inline"
            loading="lazy"
            decoding="async"
          />
        </div>
      </section>

      {/* ══════════  VALUES  ══════════ */}
      <section className={`ap-values ${isVisible(2) ? 'on' : ''}`} ref={register(2)}>
        <div className="ap-values__label" aria-hidden="true">
          {t('aboutUsPage.valuesLabel')}
        </div>

        <div className="ap-values__list">
          {values.map((v, i) => (
            <div className="av-item" key={v.n} style={{ transitionDelay: `${i * 0.15}s` }}>
              <span className="av-num" aria-hidden="true">
                {v.n}
              </span>
              <div>
                <h3 className="av-title">{t(v.titleKey)}</h3>
                <p className="av-desc">{t(v.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════  PROCESS  ══════════ */}
      <section className={`ap-process ${isVisible(3) ? 'on' : ''}`} ref={register(3)}>
        <div className="ap-process__header">
          <p className="ap-process__eyebrow">{t('aboutUsPage.processSubtitle')}</p>
          <h2 className="ap-process__h2">{t('aboutUsPage.processTitle')}</h2>
        </div>

        <div className="ap-process__grid">
          <div className="pg-row pg-row--a">
            <img
              src={aboutImg1}
              alt="Selecting premium yarns"
              className="pg-img pg-img--lg"
              loading="lazy"
              decoding="async"
            />
            <div className="pg-text">
              <span className="pg-num" aria-hidden="true">
                01
              </span>
              <h3>{t('aboutUsPage.step1Title')}</h3>
              <p>{t('aboutUsPage.step1Desc')}</p>
            </div>
          </div>

          <div className="pg-divider" aria-hidden="true" />

          <div className="pg-row pg-row--b">
            <div className="pg-text pg-text--right">
              <span className="pg-num" aria-hidden="true">
                02
              </span>
              <h3>{t('aboutUsPage.step2Title')}</h3>
              <p>{t('aboutUsPage.step2Desc')}</p>
            </div>
            <img
              src={aboutImg2}
              alt="Crocheting with intention"
              className="pg-img pg-img--lg"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="pg-divider" aria-hidden="true" />

          <div className="pg-row pg-row--a">
            <img
              src={aboutImg4}
              alt="Finishing with love"
              className="pg-img pg-img--lg"
              loading="lazy"
              decoding="async"
            />
            <div className="pg-text">
              <span className="pg-num" aria-hidden="true">
                03
              </span>
              <span className="pg-cursive" aria-hidden="true">
                With Love
              </span>
              <h3>{t('aboutUsPage.step3Title')}</h3>
              <p>{t('aboutUsPage.step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsDetail;
