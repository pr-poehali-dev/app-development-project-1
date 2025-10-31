import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AuthModal from '@/components/AuthModal';
import ChatRoom from '@/components/ChatRoom';

type Student = {
  id: number;
  name: string;
  phone: string;
};

type Teacher = {
  id: number;
  name: string;
  phone: string;
};

type Admin = {
  id: number;
  name: string;
  phone: string;
};

type Lesson = {
  number: number;
  subject: string;
  startTime: string;
  endTime: string;
};

type DaySchedule = {
  day: string;
  lessons: Lesson[];
};

export default function Index() {
  const [activeSection, setActiveSection] = useState<'home' | 'schedule' | 'news' | 'contacts' | 'chat'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const storedIsAdmin = localStorage.getItem('isAdmin');
    if (storedUserId && storedUsername) {
      setUserId(parseInt(storedUserId));
      setUsername(storedUsername);
      setIsAuthenticated(true);
      setIsAdmin(storedIsAdmin === 'true');
    }
  }, []);

  const handleAuthSuccess = (newUserId: number, newUsername: string) => {
    setUserId(newUserId);
    setUsername(newUsername);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setActiveSection('chat');
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    setUserId(null);
    setUsername('');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setActiveSection('home');
  };

  const handleAdminStatusChange = (adminStatus: boolean) => {
    setIsAdmin(adminStatus);
    localStorage.setItem('isAdmin', adminStatus.toString());
  };

  const handleChatClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setActiveSection('chat');
    }
  };

  const admins: Admin[] = [
    { id: 1, name: 'Дмитрий Скороваров', phone: '+7 991 653 23 46' }
  ];

  const teachers: Teacher[] = [
    { id: 1, name: 'Лариса Николаевна', phone: '+7 917 528-32-06' },
    { id: 2, name: 'Оксана Владимировна', phone: '+7 903 506-52-18' }
  ];

  const lessonTimes = [
    { number: 1, startTime: '08:30', endTime: '09:15' },
    { number: 2, startTime: '09:25', endTime: '10:10' },
    { number: 3, startTime: '10:30', endTime: '11:15' },
    { number: 4, startTime: '11:35', endTime: '12:20' },
    { number: 5, startTime: '12:30', endTime: '13:15' },
    { number: 6, startTime: '13:25', endTime: '14:10' }
  ];

  const schedule: DaySchedule[] = [
    {
      day: 'Понедельник',
      lessons: [
        { number: 1, subject: 'РОВ', startTime: '08:30', endTime: '09:15' },
        { number: 2, subject: 'Математика', startTime: '09:25', endTime: '10:10' },
        { number: 3, subject: 'ИнЯз', startTime: '10:30', endTime: '11:15' },
        { number: 4, subject: 'Русский язык', startTime: '11:35', endTime: '12:20' },
        { number: 5, subject: 'Литература', startTime: '12:30', endTime: '13:15' },
        { number: 6, subject: 'Английский язык', startTime: '13:25', endTime: '14:10' }
      ]
    },
    {
      day: 'Вторник',
      lessons: [
        { number: 1, subject: 'Английский язык', startTime: '08:30', endTime: '09:15' },
        { number: 2, subject: 'Русский язык', startTime: '09:25', endTime: '10:10' },
        { number: 3, subject: 'Математика', startTime: '10:30', endTime: '11:15' },
        { number: 4, subject: 'История', startTime: '11:35', endTime: '12:20' },
        { number: 5, subject: 'Литература', startTime: '12:30', endTime: '13:15' },
        { number: 6, subject: 'Музыка/Труд', startTime: '13:25', endTime: '14:10' }
      ]
    },
    {
      day: 'Среда',
      lessons: [
        { number: 1, subject: 'Труд', startTime: '08:30', endTime: '09:15' },
        { number: 2, subject: 'Труд', startTime: '09:25', endTime: '10:10' },
        { number: 3, subject: 'Математика', startTime: '10:30', endTime: '11:15' },
        { number: 4, subject: 'Русский язык', startTime: '11:35', endTime: '12:20' },
        { number: 5, subject: 'Информатика', startTime: '12:30', endTime: '13:15' },
        { number: 6, subject: 'Английский язык', startTime: '13:25', endTime: '14:10' }
      ]
    },
    {
      day: 'Четверг',
      lessons: [
        { number: 1, subject: 'История', startTime: '08:30', endTime: '09:15' },
        { number: 2, subject: 'Русский язык', startTime: '09:25', endTime: '10:10' },
        { number: 3, subject: 'Математика', startTime: '10:30', endTime: '11:15' },
        { number: 4, subject: 'Английский язык', startTime: '11:35', endTime: '12:20' },
        { number: 5, subject: 'География', startTime: '12:30', endTime: '13:15' },
        { number: 6, subject: 'Физкультура', startTime: '13:25', endTime: '14:10' }
      ]
    },
    {
      day: 'Пятница',
      lessons: [
        { number: 1, subject: 'Математика', startTime: '08:30', endTime: '09:15' },
        { number: 2, subject: 'Русский язык', startTime: '09:25', endTime: '10:10' },
        { number: 3, subject: 'История', startTime: '10:30', endTime: '11:15' },
        { number: 4, subject: 'Литература', startTime: '11:35', endTime: '12:20' },
        { number: 5, subject: 'Биология', startTime: '12:30', endTime: '13:15' },
        { number: 6, subject: 'Английский язык', startTime: '13:25', endTime: '14:10' }
      ]
    }
  ];

  const students: Student[] = [
    { id: 1, name: 'Жанер', phone: '+7 926 288-38-77' },
    { id: 2, name: 'Алексей Гусев', phone: '+7 969 088-06-74' },
    { id: 3, name: 'Ваня Левашов', phone: '+7 967 207-03-00' },
    { id: 4, name: 'Акопян Артем', phone: '+7 917 565-09-85' },
    { id: 5, name: 'Арина Автономова', phone: '+7 926 893-02-05' },
    { id: 6, name: 'Дима Селезнев', phone: '+7 977 899-79-37' },
    { id: 7, name: 'Катя Зубова', phone: '+7 985 168-66-26' },
    { id: 8, name: 'РАДИОНОВ Матвей', phone: '+7 985 192-79-50' },
    { id: 9, name: 'Терехов Матвей', phone: '+7 915 325-57-67' },
    { id: 10, name: 'Оля Кормилицина', phone: '+7 985 577-70-04' },
    { id: 11, name: 'Мария', phone: '+7 969 100-95-08' },
    { id: 12, name: 'Полина Новикова', phone: '+7 926 933-92-14' },
    { id: 13, name: 'София', phone: '+7 985 050-65-84' }
  ];

  const newsItems = [
    {
      id: 1,
      title: 'Обновление платформы',
      description: 'Запущена новая версия с улучшенным интерфейсом и быстродействием',
      date: '28 октября 2025'
    },
    {
      id: 2,
      title: 'Новые контакты',
      description: 'Добавлены контакты всех учеников для удобной связи',
      date: '30 октября 2025'
    },
    {
      id: 3,
      title: 'Техническое обслуживание',
      description: 'Плановые работы завершены успешно, все системы работают стабильно',
      date: '20 октября 2025'
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#2a2a2a]">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/30 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              5У
            </h1>
            <div className="flex gap-6">
              {[
                { id: 'home', label: 'Главная', icon: 'Home', onClick: () => setActiveSection('home') },
                { id: 'schedule', label: 'Расписание', icon: 'Calendar', onClick: () => setActiveSection('schedule') },
                { id: 'chat', label: 'Чат', icon: 'MessageCircle', onClick: handleChatClick },
                { id: 'news', label: 'Новости', icon: 'Newspaper', onClick: () => setActiveSection('news') },
                { id: 'contacts', label: 'Контакты', icon: 'Users', onClick: () => setActiveSection('contacts') }
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'default' : 'ghost'}
                  onClick={item.onClick}
                  className="flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Icon name={item.icon as any} size={18} />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        {activeSection === 'home' && (
          <div className="space-y-16 animate-fade-in">
            <section className="text-center space-y-6 py-20">
              <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent animate-slide-up">
                Добро пожаловать в 5У
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Контакты учеников и последние новости класса
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-8">
                <Button size="lg" onClick={() => setActiveSection('contacts')} className="hover:scale-105 transition-transform">
                  <Icon name="Users" size={20} className="mr-2" />
                  Контакты учеников
                </Button>
                <Button size="lg" variant="outline" onClick={() => setActiveSection('news')} className="hover:scale-105 transition-transform">
                  <Icon name="Newspaper" size={20} className="mr-2" />
                  Читать новости
                </Button>
                <Button 
                  size="lg" 
                  variant="default"
                  asChild
                  className="bg-[#25D366] hover:bg-[#20BD5C] text-white hover:scale-105 transition-transform"
                >
                  <a href="https://chat.whatsapp.com/HfGjH0oP5BTDfsfD1vzElG?mode=wwt" target="_blank" rel="noopener noreferrer">
                    <Icon name="MessageCircle" size={20} className="mr-2" />
                    Чат класса в WhatsApp
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="default"
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 transition-transform"
                >
                  <a href="https://delta-ai-project--preview.poehali.dev/" target="_blank" rel="noopener noreferrer">
                    <Icon name="Brain" size={20} className="mr-2" />
                    Delta ИИ
                  </a>
                </Button>
                {isAdmin && (
                  <Button 
                    size="lg" 
                    variant="default"
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white hover:scale-105 transition-transform"
                    onClick={() => window.open('https://poehali.dev/editor', '_blank')}
                  >
                    <Icon name="Settings" size={20} className="mr-2" />
                    Редактировать сайт 👑
                  </Button>
                )}
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              {[
                { icon: 'Users', title: 'Контакты', desc: 'Все номера учеников в одном месте' },
                { icon: 'Search', title: 'Удобный поиск', desc: 'Быстро найдите нужный контакт' },
                { icon: 'Newspaper', title: 'Новости', desc: 'Актуальная информация о классе' }
              ].map((feature, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:scale-105">
                  <CardContent className="pt-6 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name={feature.icon as any} size={32} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </section>
          </div>
        )}

        {activeSection === 'chat' && isAuthenticated && userId && (
          <ChatRoom 
            userId={userId} 
            username={username} 
            onLogout={handleLogout}
            isAdmin={isAdmin}
            onAdminStatusChange={handleAdminStatusChange}
          />
        )}

        {activeSection === 'schedule' && (
          <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-3xl font-bold">Расписание уроков 5У</h2>
              <p className="text-muted-foreground">
                Расписание занятий на неделю
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schedule.map((day, dayIndex) => {
                const now = new Date();
                const currentDay = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'][now.getDay()];
                const currentTime = now.getHours() * 60 + now.getMinutes();
                const isToday = day.day === currentDay;

                return (
                  <Card key={dayIndex} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all hover:scale-[1.02]" style={{ animationDelay: `${dayIndex * 0.1}s` }}>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Icon name="Calendar" size={20} className="text-primary" />
                        {day.day}
                      </h3>
                      <div className="space-y-3">
                        {day.lessons.map((lesson) => {
                          const [startHour, startMin] = lesson.startTime.split(':').map(Number);
                          const [endHour, endMin] = lesson.endTime.split(':').map(Number);
                          const lessonStart = startHour * 60 + startMin;
                          const lessonEnd = endHour * 60 + endMin;
                          const isCurrentLesson = isToday && currentTime >= lessonStart && currentTime <= lessonEnd;

                          return (
                            <div 
                              key={lesson.number} 
                              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                                isCurrentLesson 
                                  ? 'bg-green-500/20 border-2 border-green-500/50 shadow-lg shadow-green-500/20' 
                                  : 'bg-secondary/30 hover:bg-secondary/50'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold ${
                                isCurrentLesson ? 'bg-green-500/40' : 'bg-primary/20'
                              }`}>
                                {lesson.number}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{lesson.subject}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {lesson.startTime} - {lesson.endTime}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'news' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold mb-8">Последние новости</h2>
            {newsItems.map((item, index) => (
              <Card key={item.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all hover:scale-[1.02]" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon name="Newspaper" size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground mb-3">{item.description}</p>
                      <p className="text-sm text-primary">{item.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeSection === 'contacts' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Контакты учеников 5У</h2>
                <p className="text-muted-foreground">
                  Все контакты учеников класса для быстрой связи
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Shield" size={24} className="text-primary" />
                  Администраторы
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {admins.map((admin, index) => (
                    <Card key={admin.id} className="bg-gradient-to-br from-amber-500/10 to-amber-600/20 backdrop-blur-sm border-amber-500/30 hover:border-amber-500/50 transition-all hover:scale-[1.02]" style={{ animationDelay: `${index * 0.05}s` }}>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                            <Icon name="Shield" size={24} className="text-amber-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-1 truncate">{admin.name}</h3>
                            <a 
                              href={`tel:${admin.phone}`}
                              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                            >
                              <Icon name="Phone" size={16} />
                              <span className="text-sm">{admin.phone}</span>
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Icon name="GraduationCap" size={24} className="text-primary" />
                  Учителя
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {teachers.map((teacher, index) => (
                    <Card key={teacher.id} className="bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-all hover:scale-[1.02]" style={{ animationDelay: `${index * 0.05}s` }}>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <Icon name="GraduationCap" size={24} className="text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg mb-1 truncate">{teacher.name}</h3>
                            <a 
                              href={`tel:${teacher.phone}`}
                              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                            >
                              <Icon name="Phone" size={16} />
                              <span className="text-sm">{teacher.phone}</span>
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск по имени или номеру телефона..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Users" size={24} className="text-primary" />
                  Ученики
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredStudents.map((student, index) => (
                  <Card key={student.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all hover:scale-[1.02]" style={{ animationDelay: `${index * 0.05}s` }}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon name="User" size={24} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-1 truncate">{student.name}</h3>
                          <a 
                            href={`tel:${student.phone}`}
                            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                          >
                            <Icon name="Phone" size={16} />
                            <span className="text-sm">{student.phone}</span>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  ))}
                </div>
              </div>

              {filteredStudents.length === 0 && (
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-12 text-center">
                    <Icon name="SearchX" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Ничего не найдено</p>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-card/50 backdrop-blur-sm border-border/50 mt-8">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <Icon name="Mail" size={20} className="text-primary" />
                      Общая информация
                    </h3>
                    <div className="space-y-3 text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <Icon name="Mail" size={18} className="text-primary" />
                        <span>Email: skorovarovd2014@gmail.com</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Icon name="Phone" size={18} className="text-primary" />
                        <span>Телефон: 7 991 653 23 46</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 mt-20 py-8 backdrop-blur-sm bg-background/30">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>© 2025 5У. Все права защищены.</p>
        </div>
      </footer>

      {showAuthModal && <AuthModal onSuccess={handleAuthSuccess} />}
    </div>
  );
}