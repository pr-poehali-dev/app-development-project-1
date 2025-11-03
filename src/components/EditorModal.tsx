import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

type EditorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateNews: (title: string, content: string) => void;
  onCreateContact: (name: string, phone: string, role: 'ученик' | 'админ' | 'учитель') => void;
  onCreateBadge: (badge: { name: string; icon: string; background: string; condition: string }) => void;
};

type EditorMode = 'main' | 'news' | 'contact' | 'badge';

const ICON_OPTIONS = [
  'Star', 'Heart', 'MessageSquare', 'Trophy', 'Award', 'Target', 'Zap', 'Flame',
  'BookOpen', 'GraduationCap', 'Brain', 'Lightbulb', 'Rocket', 'Crown', 'Shield',
  'Sparkles', 'Medal', 'Flag', 'Check', 'Plus', 'Code', 'Palette', 'Music',
  'Camera', 'Users', 'Coffee', 'Sun', 'Moon', 'Cloud', 'Umbrella', 'Gift',
  'Cake', 'Clock', 'Calendar', 'Map', 'Compass', 'Anchor', 'Key', 'Lock',
  'Eye', 'Hand', 'Smile', 'Frown', 'Laugh', 'ThumbsUp', 'ThumbsDown', 'Bookmark',
  'Tag', 'Bell', 'Volume2', 'Mic'
];

const BG_OPTIONS = [
  { name: 'Синий', class: 'bg-blue-500' },
  { name: 'Красный', class: 'bg-red-500' },
  { name: 'Зелёный', class: 'bg-green-500' },
  { name: 'Жёлтый', class: 'bg-yellow-500' },
  { name: 'Фиолетовый', class: 'bg-purple-500' },
  { name: 'Розовый', class: 'bg-pink-500' },
  { name: 'Индиго', class: 'bg-indigo-500' },
  { name: 'Оранжевый', class: 'bg-orange-500' },
  { name: 'Бирюзовый', class: 'bg-teal-500' },
  { name: 'Циан', class: 'bg-cyan-500' },
  { name: 'Серый', class: 'bg-gray-500' },
  { name: 'Тёмно-синий', class: 'bg-blue-700' },
  { name: 'Тёмно-красный', class: 'bg-red-700' },
  { name: 'Тёмно-зелёный', class: 'bg-green-700' },
  { name: 'Изумрудный', class: 'bg-emerald-500' },
];

export default function EditorModal({ isOpen, onClose, onCreateNews, onCreateContact, onCreateBadge }: EditorModalProps) {
  const [mode, setMode] = useState<EditorMode>('main');
  
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRole, setContactRole] = useState<'ученик' | 'админ' | 'учитель'>('ученик');
  
  const [badgeName, setBadgeName] = useState('');
  const [badgeCondition, setBadgeCondition] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Star');
  const [selectedBg, setSelectedBg] = useState('bg-blue-500');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);

  if (!isOpen) return null;

  const handleCreateNews = () => {
    onCreateNews(newsTitle, newsContent);
    setNewsTitle('');
    setNewsContent('');
    setMode('main');
  };

  const handleCreateContact = () => {
    onCreateContact(contactName, contactPhone, contactRole);
    setContactName('');
    setContactPhone('');
    setContactRole('ученик');
    setMode('main');
  };

  const handleCreateBadge = () => {
    onCreateBadge({
      name: badgeName,
      icon: selectedIcon,
      background: selectedBg,
      condition: badgeCondition
    });
    setBadgeName('');
    setBadgeCondition('');
    setSelectedIcon('Star');
    setSelectedBg('bg-blue-500');
    setMode('main');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="w-full max-w-2xl bg-card border-border shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Редакция</h2>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {mode === 'main' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                size="lg"
                variant="outline"
                className="h-32 flex flex-col gap-3"
                onClick={() => setMode('news')}
              >
                <Icon name="Newspaper" size={32} />
                <span className="text-lg">Новость</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-32 flex flex-col gap-3"
                onClick={() => setMode('contact')}
              >
                <Icon name="UserPlus" size={32} />
                <span className="text-lg">Контакт</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-32 flex flex-col gap-3"
                onClick={() => setMode('badge')}
              >
                <Icon name="Award" size={32} />
                <span className="text-lg">Префикс</span>
              </Button>
            </div>
          )}

          {mode === 'news' && (
            <div className="space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setMode('main')}>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Назад
              </Button>
              <div>
                <label className="text-sm font-medium mb-2 block">Заголовок</label>
                <Input
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder="Введите заголовок новости"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Содержание</label>
                <textarea
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="Введите текст новости"
                  className="w-full p-3 rounded-lg border bg-background text-foreground min-h-[150px]"
                />
              </div>
              <Button onClick={handleCreateNews} disabled={!newsTitle.trim() || !newsContent.trim()}>
                Создать новость
              </Button>
            </div>
          )}

          {mode === 'contact' && (
            <div className="space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setMode('main')}>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Назад
              </Button>
              <div>
                <label className="text-sm font-medium mb-2 block">Имя</label>
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Введите имя"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Телефон</label>
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+7 XXX XXX XX XX"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Роль</label>
                <div className="flex gap-2">
                  <Button
                    variant={contactRole === 'ученик' ? 'default' : 'outline'}
                    onClick={() => setContactRole('ученик')}
                  >
                    Ученик
                  </Button>
                  <Button
                    variant={contactRole === 'учитель' ? 'default' : 'outline'}
                    onClick={() => setContactRole('учитель')}
                  >
                    Учитель
                  </Button>
                  <Button
                    variant={contactRole === 'админ' ? 'default' : 'outline'}
                    onClick={() => setContactRole('админ')}
                  >
                    Админ
                  </Button>
                </div>
              </div>
              <Button onClick={handleCreateContact} disabled={!contactName.trim() || !contactPhone.trim()}>
                Добавить контакт
              </Button>
            </div>
          )}

          {mode === 'badge' && (
            <div className="space-y-4">
              <Button variant="ghost" size="sm" onClick={() => setMode('main')}>
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Назад
              </Button>
              
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm font-medium mb-2">Предпросмотр</p>
                <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded ${selectedBg} text-white`}>
                  <Icon name={selectedIcon as any} size={16} />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Название префикса</label>
                <Input
                  value={badgeName}
                  onChange={(e) => setBadgeName(e.target.value)}
                  placeholder="Например: Активный участник"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Условие получения</label>
                <Input
                  value={badgeCondition}
                  onChange={(e) => setBadgeCondition(e.target.value)}
                  placeholder="Например: Написать 50 сообщений"
                />
              </div>

              <div className="relative">
                <label className="text-sm font-medium mb-2 block">Значок</label>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setShowIconPicker(!showIconPicker);
                    setShowBgPicker(false);
                  }}
                >
                  <Icon name={selectedIcon as any} size={20} className="mr-2" />
                  {selectedIcon}
                </Button>
                {showIconPicker && (
                  <div className="absolute z-10 mt-2 w-full p-4 bg-popover border border-border rounded-lg shadow-lg max-h-[300px] overflow-y-auto grid grid-cols-6 gap-2">
                    {ICON_OPTIONS.map((icon) => (
                      <button
                        key={icon}
                        className="p-2 hover:bg-muted rounded flex items-center justify-center"
                        onClick={() => {
                          setSelectedIcon(icon);
                          setShowIconPicker(false);
                        }}
                      >
                        <Icon name={icon as any} size={20} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="text-sm font-medium mb-2 block">Фон</label>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setShowBgPicker(!showBgPicker);
                    setShowIconPicker(false);
                  }}
                >
                  <div className={`w-5 h-5 rounded ${selectedBg} mr-2`} />
                  {BG_OPTIONS.find(bg => bg.class === selectedBg)?.name || selectedBg}
                </Button>
                {showBgPicker && (
                  <div className="absolute z-10 mt-2 w-full p-4 bg-popover border border-border rounded-lg shadow-lg max-h-[300px] overflow-y-auto grid grid-cols-2 gap-2">
                    {BG_OPTIONS.map((bg) => (
                      <button
                        key={bg.class}
                        className="p-2 hover:bg-muted rounded flex items-center gap-2"
                        onClick={() => {
                          setSelectedBg(bg.class);
                          setShowBgPicker(false);
                        }}
                      >
                        <div className={`w-5 h-5 rounded ${bg.class}`} />
                        <span className="text-sm">{bg.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={handleCreateBadge} disabled={!badgeName.trim() || !badgeCondition.trim()}>
                Создать префикс
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
