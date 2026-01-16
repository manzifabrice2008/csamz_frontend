import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Trophy, Code, Laptop, Cross, Church, User } from "lucide-react";
import nesaLogo from "@/assets/nesa.png";
import rtbLogo from "@/assets/rtb.png";
import rebLogo from "@/assets/REB_Logo.png";
import AboutsImage from "@/assets/about.jpg";
import Admin1 from "@/assets/IMG_20250523_113525_931.jpg";
import Admin2 from "@/assets/IMG_20250523_113805_509.jpg";
import Admin3 from "@/assets/IMG_20250523_113813_808.jpg";
import Admin4 from "@/assets/IMG_20250523_114224_304.jpg";
import Admin5 from "@/assets/IMG_20250523_114337_212.jpg";
import Admin6 from "@/assets/IMG_20250523_114344_415.jpg";
import AboutImage from "@/assets/economy.jpg";

const administrationStaff: Array<{ role: string; name?: string; photo?: string }> = [
  { role: "Head Master", photo: Admin1 },
  { role: "Economy", photo: AboutImage },
  { role: "DOD", photo: Admin2 },
  { role: "DOS", photo: Admin3 },
  { role: "Animateur", photo: Admin4 },
  { role: "Metron", photo: Admin5 },
  { role: "Secretary", photo: Admin6 },
  { role: "Economy", photo: AboutImage },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-20 w-64 h-64 bg-school-secondary rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-school-accent rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fadeInDown">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">About Our Institution</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fadeInUp delay-200">
            Collegio Santo Antonio Maria Zaccaria Tss is a leading TVET institution in Rwanda,
            committed to providing quality technical and vocational education in Gicumbi, Muko.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-fadeInLeft">
            <h3 className="text-3xl md:text-4xl font-bold text-school-primary dark:text-school-accent mb-6">
              Our Story & Heritage
            </h3>

            {/* Catholic Institution Badge */}
            <div className="flex items-center gap-3 mb-6 bg-gradient-to-r from-school-primary/10 to-school-secondary/10 dark:from-school-accent/10 dark:to-school-primary/10 p-4 rounded-lg border-l-4 border-school-primary dark:border-school-accent">
              <div className="bg-school-primary dark:bg-school-accent p-3 rounded-full">
                <Cross className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-school-primary dark:text-school-accent">Catholic TVET Institution</p>
                <p className="text-sm text-muted-foreground">Founded by Barnabite Fathers in 2011</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              <strong>Founded in 2011</strong> by the <strong>Barnabite Fathers</strong>, Collegio Santo Antonio Maria Zaccaria
              is a Catholic TVET institution named after Saint Antonio Maria Zaccaria, the founder of the Barnabite Order.
              Our institution embodies the values of dedication, service, and excellence in education, rooted in the
              Barnabite tradition of holistic formation and community service.
            </p>
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              Located in the heart of Muko, Gicumbi District, we have been serving the community for over a decade,
              providing world-class technical and vocational training that meets international standards. Under the
              guidance of the Barnabite Fathers, we combine spiritual formation with practical skills development.
            </p>
            <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
              Our TVET programs are designed to bridge the skills gap in Rwanda's growing economy,
              focusing on practical training that prepares students for immediate employment in
              various technical fields, while nurturing their spiritual and moral development.
            </p>
            <div className="bg-school-primary/5 dark:bg-school-accent/10 p-6 rounded-lg">
              <p className="text-school-primary dark:text-school-accent font-semibold text-lg mb-2">
                "Excellence in Technical Education - Building Rwanda's Future"
              </p>
              <p className="text-sm text-muted-foreground italic">
                Founded by Barnabite Fathers • Est. 2011 • Catholic TVET Institution
              </p>
            </div>
          </div>

          {/* Founder Image Section */}
          <div className="animate-fadeInRight space-y-6">
            <Card className="overflow-hidden shadow-2xl border-2 border-school-primary/20 dark:border-school-accent/20 hover-lift">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={AboutsImage}
                    alt="Barnabite Fathers - Founders"
                    loading="lazy"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Church className="h-5 w-5" />
                      <span className="text-sm font-semibold">Barnabite Fathers</span>
                    </div>
                    <h4 className="text-2xl font-bold mb-1">Our Founders</h4>
                    <p className="text-sm text-white/90">Serving God through Education since 2011</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Catholic Values Card */}
            <Card className="bg-gradient-to-br from-school-primary/5 to-school-secondary/5 dark:from-school-accent/5 dark:to-school-primary/5 border-2 border-school-primary/20 dark:border-school-accent/20 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-school-primary dark:bg-school-accent p-3 rounded-full flex-shrink-0">
                    <Cross className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-school-primary dark:text-school-accent mb-2">
                      Catholic Values & Education
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      As a Catholic institution, we integrate faith, values, and academic excellence.
                      Our Barnabite tradition emphasizes holistic formation, combining technical skills
                      with spiritual growth and moral development.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeInRight">
            <Card className="text-center shadow-lg border bg-card hover-lift animate-scaleIn delay-100">
              <CardContent className="p-6">
                <div className="bg-school-primary/10 dark:bg-school-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                  <Trophy className="h-8 w-8 text-school-primary dark:text-school-accent" />
                </div>
                <h4 className="font-bold text-2xl text-school-primary dark:text-school-accent mb-2">1000+</h4>
                <p className="text-muted-foreground">Graduates Employed</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border bg-card hover-lift animate-scaleIn delay-200">
              <CardContent className="p-6">
                <div className="bg-school-secondary/10 dark:bg-school-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                  <Target className="h-8 w-8 text-school-secondary dark:text-school-accent" />
                </div>
                <h4 className="font-bold text-2xl text-school-primary dark:text-school-accent mb-2">5+</h4>
                <p className="text-muted-foreground">TVET Programs</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border bg-card hover-lift animate-scaleIn delay-300">
              <CardContent className="p-6">
                <div className="bg-school-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                  <Eye className="h-8 w-8 text-school-accent" />
                </div>
                <h4 className="font-bold text-2xl text-school-primary dark:text-school-accent mb-2">95%</h4>
                <p className="text-muted-foreground">Employment Rate</p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg border bg-card hover-lift animate-scaleIn delay-400">
              <CardContent className="p-6">
                <div className="bg-school-primary/10 dark:bg-school-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                  <Heart className="h-8 w-8 text-school-primary dark:text-school-accent" />
                </div>
                <h4 className="font-bold text-2xl text-school-primary dark:text-school-accent mb-2">14+</h4>
                <p className="text-muted-foreground">Years of Excellence</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center shadow-lg border-0 bg-school-primary dark:bg-school-accent text-white dark:text-school-primary hover-lift animate-fadeInUp delay-100 transform hover:scale-105 transition-all duration-500">
            <CardContent className="p-8">
              <Target className="h-12 w-12 mx-auto mb-4 text-school-accent dark:text-school-primary animate-float" />
              <h4 className="text-2xl font-bold mb-4">Mission</h4>
              <p className="leading-relaxed">
                L'encadrement de La Jeunesse dans L'ecole .
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg border-0 bg-school-secondary dark:bg-school-primary text-white hover-lift animate-fadeInUp delay-200 transform hover:scale-105 transition-all duration-500">
            <CardContent className="p-8">
              <Eye className="h-12 w-12 mx-auto mb-4 text-white animate-float delay-200" />
              <h4 className="text-2xl font-bold mb-4">Vision</h4>
              <p className="leading-relaxed">
                Procedure une formation humaine integrale aux Jeunes en Les guident  vers une maturite spiritulle intellectuelle, Ethique, Technique et Professionnelle .
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg border-0 bg-school-accent dark:bg-school-secondary text-school-primary dark:text-white hover-lift animate-fadeInUp delay-300 transform hover:scale-105 transition-all duration-500">
            <CardContent className="p-8">
              <Heart className="h-12 w-12 mx-auto mb-4 text-school-primary dark:text-white animate-float delay-400" />
              <h4 className="text-2xl font-bold mb-4">Objectives</h4>
              <p className="leading-relaxed">
                Produire de Jeunes Technciens Qualifies et Competents en Matiere de Construction et D'informatique
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-20">
          <div className="text-center mb-12 animate-fadeInDown">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Administration Staff</span>
            </h3>
            <p className="text-muted-foreground text-lg">
              Dedicated leaders ensuring excellence in education and student support
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {administrationStaff.map((member) => (
              <Card
                key={member.role}
                className="hover-lift animate-fadeInUp shadow-lg border-2 hover:border-school-primary dark:hover:border-school-accent transition-all duration-300"
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-school-primary/20 dark:border-school-accent/20 bg-gradient-to-br from-school-primary/10 to-school-secondary/10 flex items-center justify-center">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={(member.name || member.role) + " photo"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <User className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-school-primary dark:text-school-accent">
                    {member.name || member.role}
                  </h4>
                  {member.name && (
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <div className="text-center mb-12 animate-fadeInDown">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Our Partners</span>
            </h3>
            <p className="text-muted-foreground text-lg">
              We collaborate with key national education bodies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            <Card className="hover-lift animate-fadeInUp delay-100 shadow-lg border-2 hover:border-school-primary dark:hover:border-school-accent transition-all duration-300">
              <CardContent className="p-6 text-center">
                <img src={nesaLogo} alt="NESA" loading="lazy" className="h-16 mx-auto object-contain" />
                <div className="mt-3 font-semibold text-school-primary dark:text-school-accent">NESA</div>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-fadeInUp delay-200 shadow-lg border-2 hover:border-school-primary dark:hover:border-school-accent transition-all duration-300">
              <CardContent className="p-6 text-center">
                <img src={rtbLogo} alt="RTB" loading="lazy" className="h-16 mx-auto object-contain" />
                <div className="mt-3 font-semibold text-school-primary dark:text-school-accent">RTB</div>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-fadeInUp delay-300 shadow-lg border-2 hover:border-school-primary dark:hover:border-school-accent transition-all duration-300">
              <CardContent className="p-6 text-center">
                <img src={rebLogo} alt="REB" loading="lazy" className="h-20 mx-auto object-contain" />
                <div className="mt-3 font-semibold text-school-primary dark:text-school-accent">REB</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Development Team Section */}
        <div className="mt-20">
          <div className="text-center mb-12 animate-fadeInDown">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="gradient-text">Website Development Team</span>
            </h3>
            <p className="text-muted-foreground text-lg">
              Meet the talented developers who created this website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Developer 1 - Pac Besigye */}
            <Card className="hover-lift animate-fadeInUp delay-100 shadow-lg border-2 hover:border-school-primary dark:hover:border-school-accent transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-school-primary to-school-secondary rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Code className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-xl font-bold text-school-primary dark:text-school-accent mb-2">
                  Manzi Besigye Fabrice
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Lead Developer
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Full-stack developer specializing in React and modern web technologies Backend  & Frontend
                </p>
              </CardContent>
            </Card>

            {/* Developer 2 - Panda */}
            <Card className="hover-lift animate-fadeInUp delay-200 shadow-lg border-2 hover:border-school-primary dark:hover:border-school-accent transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-school-secondary to-school-accent rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Laptop className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-xl font-bold text-school-primary dark:text-school-accent mb-2">
                  Nsabimana Xavier
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Frontend Developer
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  UI/UX specialist focused on creating beautiful and responsive designs
                </p>
              </CardContent>
            </Card>

            {/* Developer 3 */}
            <Card className="hover-lift animate-fadeInUp delay-300 shadow-lg border-2 hover:border-school-primary dark:hover:border-school-accent transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-school-accent to-school-primary rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Code className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-xl font-bold text-school-primary dark:text-school-accent mb-2">
                  Twizeyimana Pascal
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Backend Developer
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Backend specialist handling server-side logic and database management
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;