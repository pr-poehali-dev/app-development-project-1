import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
};

export default function Index() {
  const [activeSection, setActiveSection] = useState<'home' | 'chat' | 'news' | 'contacts'>('home');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Здравствуйте! Чем могу помочь?', sender: 'support', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    setTimeout(() => {
      const supportMessage: Message = {
        id: messages.length + 2,
        text: 'Спасибо за ваше сообщение! Наш специалист ответит в ближайшее время.',
        sender: 'support',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, supportMessage]);
    }, 1000);
  };

  const newsItems = [
    {
      id: 1,
      title: 'Обновление платформы',
      description: 'Запущена новая версия с улучшенным интерфейсом и быстродействием',
      date: '28 октября 2025'
    },
    {
      id: 2,
      title: 'Новые возможности чата',
      description: 'Добавлена поддержка файлов и эмодзи в реальном времени',
      date: '25 октября 2025'
    },
    {
      id: 3,
      title: 'Техническое обслуживание',
      description: 'Плановые работы завершены успешно, все системы работают стабильно',
      date: '20 октября 2025'
    }
  ];

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
                { id: 'home', label: 'Главная', icon: 'Home' },
                { id: 'chat', label: 'Чат', icon: 'MessageCircle' },
                { id: 'news', label: 'Новости', icon: 'Newspaper' },
                { id: 'contacts', label: 'Контакты', icon: 'Mail' }
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'default' : 'ghost'}
                  onClick={() => setActiveSection(item.id as typeof activeSection)}
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
                Современная платформа для общения и обмена информацией
              </p>
              <div className="flex gap-4 justify-center pt-8">
                <Button size="lg" onClick={() => setActiveSection('chat')} className="hover:scale-105 transition-transform">
                  <Icon name="MessageCircle" size={20} className="mr-2" />
                  Начать общение
                </Button>
                <Button size="lg" variant="outline" onClick={() => setActiveSection('news')} className="hover:scale-105 transition-transform">
                  <Icon name="Newspaper" size={20} className="mr-2" />
                  Читать новости
                </Button>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              {[
                { icon: 'Zap', title: 'Быстро', desc: 'Мгновенная отправка сообщений' },
                { icon: 'Shield', title: 'Безопасно', desc: 'Защита данных на всех уровнях' },
                { icon: 'Users', title: 'Удобно', desc: 'Интуитивный интерфейс для всех' }
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

        {activeSection === 'chat' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="Headphones" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Поддержка 5У</h3>
                    <p className="text-sm text-muted-foreground">Онлайн</p>
                  </div>
                </div>

                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex gap-2 pt-4 border-t border-border/50">
                  <Input
                    placeholder="Напишите сообщение..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="bg-background/50"
                  />
                  <Button onClick={sendMessage} size="icon" className="shrink-0">
                    <Icon name="Send" size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>
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
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-4 pb-6 border-b border-border/50">
                  <h2 className="text-3xl font-bold">Свяжитесь с нами</h2>
                  <p className="text-muted-foreground">
                    Мы всегда рады помочь и ответить на ваши вопросы
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: 'Mail', label: 'Email', value: 'info@5u.example.com' },
                    { icon: 'Phone', label: 'Телефон', value: '+7 (XXX) XXX-XX-XX' },
                    { icon: 'MapPin', label: 'Адрес', value: 'г. Москва, ул. Примерная, д. 1' },
                    { icon: 'Clock', label: 'Время работы', value: 'Пн-Пт: 9:00 - 18:00' }
                  ].map((contact, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name={contact.icon as any} size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{contact.label}</p>
                        <p className="font-medium">{contact.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full" size="lg" onClick={() => setActiveSection('chat')}>
                  <Icon name="MessageCircle" size={20} className="mr-2" />
                  Написать в чат
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 mt-20 py-8 backdrop-blur-sm bg-background/30">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>© 2025 5У. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
