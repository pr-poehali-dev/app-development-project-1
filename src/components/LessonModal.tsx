import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Lesson = {
  number: number;
  subject: string;
  startTime: string;
  endTime: string;
};

type LessonModalProps = {
  lesson: Lesson | null;
  onClose: () => void;
  userId: number | null;
};

const CLASSROOM_MAP: Record<string, string> = {
  'РОВ': '310',
  'Русский язык': '303',
  'Математика': '204',
  'Литература': '303',
  'Английский язык': '312',
  'История': '209',
  'Изо': '210',
  'Труд': '125',
  'Информатика': '201',
  'Музыка': '205',
  'География': '310',
  'Биология': '109'
};

export default function LessonModal({ lesson, onClose, userId }: LessonModalProps) {
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [timeStatus, setTimeStatus] = useState<string>('');
  const [isLessonActive, setIsLessonActive] = useState<boolean>(false);

  useEffect(() => {
    if (!lesson) return;

    const updateStatus = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const [startHour, startMinute] = lesson.startTime.split(':').map(Number);
      const [endHour, endMinute] = lesson.endTime.split(':').map(Number);
      
      const startTimeMinutes = startHour * 60 + startMinute;
      const endTimeMinutes = endHour * 60 + endMinute;

      if (currentTime >= startTimeMinutes && currentTime < endTimeMinutes) {
        setIsLessonActive(true);
        setTimeStatus('Урок идёт');
      } else if (currentTime < startTimeMinutes) {
        setIsLessonActive(false);
        const minutesUntil = startTimeMinutes - currentTime;
        const hours = Math.floor(minutesUntil / 60);
        const minutes = minutesUntil % 60;
        
        if (hours > 0) {
          setTimeStatus(`До начала урока: ${hours} ч ${minutes} мин`);
        } else {
          setTimeStatus(`До начала урока: ${minutes} мин`);
        }
      } else {
        setIsLessonActive(false);
        setTimeStatus('Урок закончился');
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000);

    return () => clearInterval(interval);
  }, [lesson]);

  useEffect(() => {
    if (!lesson) return;
    fetchLikes();
  }, [lesson]);

  const fetchLikes = async () => {
    if (!lesson) return;
    try {
      const response = await fetch(`https://functions.poehali.dev/de9b8f4e-33f8-4022-b463-c072c20d423d?subject=${encodeURIComponent(lesson.subject)}&userId=${userId}`);
      const data = await response.json();
      setLikes(data.likes || 0);
      setHasLiked(data.hasLiked || false);
    } catch (err) {
      console.error('Failed to fetch likes:', err);
    }
  };

  const toggleLike = async () => {
    if (!lesson || !userId) return;

    try {
      const response = await fetch('https://functions.poehali.dev/de9b8f4e-33f8-4022-b463-c072c20d423d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          subject: lesson.subject,
          action: hasLiked ? 'unlike' : 'like'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        setHasLiked(!hasLiked);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  if (!lesson) return null;

  const classroom = CLASSROOM_MAP[lesson.subject] || '—';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="w-full max-w-md bg-card border-border shadow-2xl animate-in fade-in zoom-in duration-300" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{lesson.subject}</h2>
              <p className="text-muted-foreground text-sm">Кабинет: {classroom}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${isLessonActive ? 'bg-green-500/20 border border-green-500/30' : 'bg-muted/50'}`}>
              <p className="text-sm text-muted-foreground mb-1">Статус</p>
              <p className={`font-semibold ${isLessonActive ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                {isLessonActive ? 'Урок идёт' : 'Урок не идёт'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Время</p>
              <p className="font-semibold">{timeStatus}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {lesson.startTime} — {lesson.endTime}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Нравится урок?</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Icon name="Heart" size={20} className="text-red-500" />
                    {likes} {likes === 1 ? 'лайк' : likes < 5 ? 'лайка' : 'лайков'}
                  </p>
                </div>
                <Button
                  size="lg"
                  variant={hasLiked ? "default" : "outline"}
                  onClick={toggleLike}
                  disabled={!userId}
                  className={hasLiked ? 'bg-red-500 hover:bg-red-600' : ''}
                >
                  <Icon name={hasLiked ? "Heart" : "Heart"} size={20} className={hasLiked ? 'fill-current' : ''} />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Icon name="Clock" size={16} />
                <span>Урок #{lesson.number}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
              <div className="flex items-center gap-1">
                <Icon name="MapPin" size={16} />
                <span>Кабинет {classroom}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}