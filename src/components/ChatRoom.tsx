import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

const CHAT_URL = 'https://functions.poehali.dev/a9200a7a-4ac5-47b0-b48a-aa315785eb3c';

type Message = {
  id: number;
  username: string;
  message: string;
  createdAt: string;
};

type ChatRoomProps = {
  userId: number;
  username: string;
  onLogout: () => void;
};

export default function ChatRoom({ userId, username, onLogout }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = async () => {
    try {
      const response = await fetch(CHAT_URL);
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          username,
          message: inputMessage.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ошибка отправки');
        setLoading(false);
        return;
      }

      setInputMessage('');
      await fetchMessages();
    } catch (err) {
      setError('Ошибка подключения');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name="MessageCircle" size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Чат класса 5У</h3>
                <p className="text-sm text-muted-foreground">
                  Вы: {username}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>

          <ScrollArea className="h-[500px] pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-20">
                  <Icon name="MessageCircle" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Пока нет сообщений</p>
                  <p className="text-sm text-muted-foreground">Будьте первым!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.username === username;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-slide-up`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {!isOwn && (
                          <p className="text-xs font-semibold mb-1 opacity-80">
                            {msg.username}
                          </p>
                        )}
                        <p className="text-sm break-words">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/50 flex items-center gap-2">
              <Icon name="AlertCircle" size={18} className="text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-border/50">
            <Input
              placeholder="Напишите сообщение..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-background/50"
              maxLength={1000}
              disabled={loading}
            />
            <Button onClick={sendMessage} size="icon" className="shrink-0" disabled={loading}>
              {loading ? (
                <Icon name="Loader2" size={20} className="animate-spin" />
              ) : (
                <Icon name="Send" size={20} />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
