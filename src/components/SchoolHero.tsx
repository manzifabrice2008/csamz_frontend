import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/computer-lab.jpg";

const SchoolHero = () => {
  const { t } = useTranslation();
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-school-primary/90 via-school-primary/80 to-school-primary/70 dark:from-school-primary/95 dark:via-school-primary/90 dark:to-school-primary/85"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fadeInDown">
            {t('heroTitle')}
            <span className="text-school-accent block animate-fadeInLeft delay-200">{t('heroSubtitle')}</span>
          </h1>

          <p className="text-xl text-white/90 mb-8 max-w-2xl leading-relaxed animate-fadeInUp delay-300">
            {t('heroDescription')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fadeInUp delay-400">
            <Button
              size="lg"
              className="bg-school-accent hover:bg-school-accent/90 text-school-primary font-semibold px-8 py-6 text-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
              asChild
            >
              <Link to="/apply">
                {t('applyAdmission')}
                <ArrowRight className="ml-2 h-5 w-5 animate-bounce-slow" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white bg-white text-school-primary hover:bg-school-primary hover:text-white hover:border-white dark:bg-transparent dark:text-white dark:hover:bg-white dark:hover:text-school-primary px-8 py-6 text-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
              asChild
            >
              <a href="#programs">
                {t('explorePrograms')}
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-3 text-white animate-fadeInLeft delay-500 hover-lift">
              <div className="bg-school-accent/20 p-3 rounded-full animate-pulse-slow">
                <Award className="h-6 w-6 text-school-accent" />
              </div>
              <div>
                <div className="font-bold text-2xl">5+</div>
                <div className="text-white/80">{t('tvetPrograms')}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-white animate-fadeInUp delay-600 hover-lift">
              <div className="bg-school-accent/20 p-3 rounded-full animate-pulse-slow">
                <Users className="h-6 w-6 text-school-accent" />
              </div>
              <div>
                <div className="font-bold text-2xl">1000+</div>
                <div className="text-white/80">{t('students')}</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-white animate-fadeInRight delay-600 hover-lift">
              <div className="bg-school-accent/20 p-3 rounded-full animate-pulse-slow">
                <BookOpen className="h-6 w-6 text-school-accent" />
              </div>
              <div>
                <div className="font-bold text-2xl">95%</div>
                <div className="text-white/80">{t('employmentRate')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolHero;