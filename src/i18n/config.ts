import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      about: 'About Us',
      programs: 'Programs',
      news: 'News & Updates',
      contact: 'Contact Us',
      apply: 'Apply Now',
      
      // Hero Section
      heroTitle: 'Empowering Rwanda Through',
      heroSubtitle: 'Technical Excellence',
      heroDescription: 'At Collegio Santo Antonio Maria Zaccaria in Gicumbi, Muko, we provide world-class TVET education that prepares students for successful careers in today\'s dynamic economy.',
      applyAdmission: 'Apply for Admission',
      explorePrograms: 'Explore Programs',
      
      // Stats
      tvetPrograms: 'TVET Programs',
      students: 'Students',
      employmentRate: 'Employment Rate',
      
      // About Section
      aboutTitle: 'About Our Institution',
      aboutDescription: 'Collegio Santo Antonio Maria Zaccaria Tss is a leading TVET institution in Rwanda, committed to providing quality technical and vocational education in Gicumbi, Muko.',
      ourStory: 'Our Story & Heritage',
      catholicInstitution: 'Catholic TVET Institution',
      foundedBy: 'Founded by Barnabite Fathers in 2011',
      ourFounders: 'Our Founders',
      servingGod: 'Serving God through Education since 2011',
      catholicValues: 'Catholic Values & Education',
      catholicValuesDesc: 'As a Catholic institution, we integrate faith, values, and academic excellence. Our Barnabite tradition emphasizes holistic formation, combining technical skills with spiritual growth and moral development.',
      
      // Programs
      programsTitle: 'Our TVET Programs',
      programsDescription: 'Discover our comprehensive range of technical and vocational training programs designed to meet industry demands.',
      softwareDevelopment: 'Software Development',
      computerSystems: 'Computer Systems',
      plumbingTechnology: 'Plumbing Technology',
      buildingConstruction: 'Building Construction',
      woodTechnology: 'Wood Technology',
      learnMore: 'Learn More',
      
      // Testimonials
      testimonialsTitle: 'Student Testimonials',
      testimonialsDescription: 'Hear from our students and graduates about their transformative experiences at CSAM Zaccaria TVET School',
      averageRating: 'Average Student Satisfaction Rating',
      reviews: 'reviews',
      shareExperience: 'Share Your Experience',
      shareExperienceDesc: 'Are you a student or graduate? Share your story with us!',
      
      // Footer
      quickLinks: 'Quick Links',
      contactInfo: 'Contact Information',
      followUs: 'Follow Us',
      allRightsReserved: 'All rights reserved',
      
      // Mission, Vision, Objectives
      mission: 'Mission',
      vision: 'Vision',
      objectives: 'Objectives',
    }
  },
  rw: {
    translation: {
      // Navigation
      home: 'Ahabanza',
      about: 'Ibyerekeye',
      programs: 'Porogaramu',
      news: 'Amakuru',
      contact: 'Twandikire',
      apply: 'Kwiyandikisha',
      
      // Hero Section
      heroTitle: 'Gutera Inkunga u Rwanda Binyuze',
      heroSubtitle: 'Mu Bumenyi Bw\'Ikoranabuhanga',
      heroDescription: 'Kuri Collegio Santo Antonio Maria Zaccaria i Gicumbi, Muko, dutanga uburezi bw\'ikoranabuhanga bw\'icy\'ejo kizaza butegura abanyeshuri kugira imyuga myiza mu bukungu bw\'iki gihe.',
      applyAdmission: 'Kwiyandikisha',
      explorePrograms: 'Reba Porogaramu',
      
      // Stats
      tvetPrograms: 'Porogaramu za TVET',
      students: 'Abanyeshuri',
      employmentRate: 'Akazi Kabonetse',
      
      // About Section
      aboutTitle: 'Ibyerekeye Ishuri Ryacu',
      aboutDescription: 'Collegio Santo Antonio Maria Zaccaria Tss ni ishuri ry\'ikoranabuhanga ryamamaye mu Rwanda, ryitanze gutanga uburezi bw\'ubumenyi bw\'ikoranabuhanga i Gicumbi, Muko.',
      ourStory: 'Amateka Yacu',
      catholicInstitution: 'Ishuri rya Gatolika rya TVET',
      foundedBy: 'Ryashinzwe na Ba Padiri Barnabite mu 2011',
      ourFounders: 'Abashinze Ishuri',
      servingGod: 'Gukorera Imana Binyuze mu Burezi kuva 2011',
      catholicValues: 'Indangagaciro za Gatolika n\'Uburezi',
      catholicValuesDesc: 'Nk\'ishuri rya Gatolika, tuhuza ukwizera, indangagaciro, n\'uburezi bw\'icy\'ejo kizaza. Imigenzo yacu ya Barnabite yibanda ku myigire yuzuye, ihuza ubumenyi bw\'ikoranabuhanga n\'imyitozo y\'umwuka n\'imyitwarire myiza.',
      
      // Programs
      programsTitle: 'Porogaramu Zacu za TVET',
      programsDescription: 'Menya porogaramu zacu z\'ubumenyi bw\'ikoranabuhanga ziteguwe gukemura ibibazo by\'inganda.',
      softwareDevelopment: 'Iterambere rya Porogaramu',
      computerSystems: 'Sisitemu za Mudasobwa',
      plumbingTechnology: 'Ikoranabuhanga ry\'Amazi',
      buildingConstruction: 'Ubwubatsi',
      woodTechnology: 'Ikoranabuhanga ry\'Ibiti',
      learnMore: 'Menya Byinshi',
      
      // Testimonials
      testimonialsTitle: 'Ubuhamya bw\'Abanyeshuri',
      testimonialsDescription: 'Umva abanyeshuri n\'abarangije amashuri bavuga ku byabagezeho kuri CSAM Zaccaria TVET',
      averageRating: 'Ikigereranyo cy\'Ibyishimye by\'Abanyeshuri',
      reviews: 'ibyibwirwa',
      shareExperience: 'Sangira Uburambe Bwawe',
      shareExperienceDesc: 'Uri umunyeshuri cyangwa warangije? Tubwire inkuru yawe!',
      
      // Footer
      quickLinks: 'Ihuza Byihuse',
      contactInfo: 'Amakuru y\'Itumanaho',
      followUs: 'Dukurikire',
      allRightsReserved: 'Uburenganzira bwose burahagaritswe',
      
      // Mission, Vision, Objectives
      mission: 'Inshingano',
      vision: 'Icyerekezo',
      objectives: 'Intego',
    }
  },
  fr: {
    translation: {
      // Navigation
      home: 'Accueil',
      about: 'À Propos',
      programs: 'Programmes',
      news: 'Actualités',
      contact: 'Contact',
      apply: 'Postuler',
      
      // Hero Section
      heroTitle: 'Autonomiser le Rwanda à Travers',
      heroSubtitle: 'L\'Excellence Technique',
      heroDescription: 'Au Collegio Santo Antonio Maria Zaccaria à Gicumbi, Muko, nous offrons une formation EFTP de classe mondiale qui prépare les étudiants à des carrières réussies dans l\'économie dynamique d\'aujourd\'hui.',
      applyAdmission: 'Postuler pour l\'Admission',
      explorePrograms: 'Explorer les Programmes',
      
      // Stats
      tvetPrograms: 'Programmes EFTP',
      students: 'Étudiants',
      employmentRate: 'Taux d\'Emploi',
      
      // About Section
      aboutTitle: 'À Propos de Notre Institution',
      aboutDescription: 'Collegio Santo Antonio Maria Zaccaria Tss est une institution EFTP de premier plan au Rwanda, engagée à fournir une éducation technique et professionnelle de qualité à Gicumbi, Muko.',
      ourStory: 'Notre Histoire et Patrimoine',
      catholicInstitution: 'Institution EFTP Catholique',
      foundedBy: 'Fondée par les Pères Barnabites en 2011',
      ourFounders: 'Nos Fondateurs',
      servingGod: 'Servir Dieu par l\'Éducation depuis 2011',
      catholicValues: 'Valeurs Catholiques et Éducation',
      catholicValuesDesc: 'En tant qu\'institution catholique, nous intégrons la foi, les valeurs et l\'excellence académique. Notre tradition barnabite met l\'accent sur la formation holistique, combinant les compétences techniques avec la croissance spirituelle et le développement moral.',
      
      // Programs
      programsTitle: 'Nos Programmes EFTP',
      programsDescription: 'Découvrez notre gamme complète de programmes de formation technique et professionnelle conçus pour répondre aux demandes de l\'industrie.',
      softwareDevelopment: 'Développement Logiciel',
      computerSystems: 'Systèmes Informatiques',
      plumbingTechnology: 'Technologie de Plomberie',
      buildingConstruction: 'Construction de Bâtiments',
      woodTechnology: 'Technologie du Bois',
      learnMore: 'En Savoir Plus',
      
      // Testimonials
      testimonialsTitle: 'Témoignages d\'Étudiants',
      testimonialsDescription: 'Écoutez nos étudiants et diplômés parler de leurs expériences transformatrices à l\'École EFTP CSAM Zaccaria',
      averageRating: 'Note Moyenne de Satisfaction des Étudiants',
      reviews: 'avis',
      shareExperience: 'Partagez Votre Expérience',
      shareExperienceDesc: 'Êtes-vous étudiant ou diplômé? Partagez votre histoire avec nous!',
      
      // Footer
      quickLinks: 'Liens Rapides',
      contactInfo: 'Informations de Contact',
      followUs: 'Suivez-Nous',
      allRightsReserved: 'Tous droits réservés',
      
      // Mission, Vision, Objectives
      mission: 'Mission',
      vision: 'Vision',
      objectives: 'Objectifs',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
