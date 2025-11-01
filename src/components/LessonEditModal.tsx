import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type Lesson = {
  number: number;
  subject: string;
  startTime: string;
  endTime: string;
};

type LessonEditModalProps = {
  lesson: Lesson;
  day: string;
  onClose: () => void;
  onSave: (lesson: Lesson) => void;
};

export default function LessonEditModal({ lesson, day, onClose, onSave }: LessonEditModalProps) {
  const [subject, setSubject] = useState(lesson.subject);
  const [startTime, setStartTime] = useState(lesson.startTime);
  const [endTime, setEndTime] = useState(lesson.endTime);

  const handleSave = () => {
    onSave({
      ...lesson,
      subject,
      startTime,
      endTime
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background/95 border-orange-500/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Icon name="Edit" size={24} className="text-orange-400" />
                Редактирование урока
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {day} | Урок #{lesson.number}
              </p>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onClose}
              className="hover:bg-destructive/20"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Предмет</label>
              <Input 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Название урока"
                className="bg-background/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Начало</label>
                <Input 
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-background/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Конец</label>
                <Input 
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1 bg-orange-500 hover:bg-orange-600">
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                Отмена
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
