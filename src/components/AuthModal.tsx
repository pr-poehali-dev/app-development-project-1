import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

const AUTH_URL = 'https://functions.poehali.dev/48f80eee-773f-4390-9a6e-c3524d053b3d';

type AuthModalProps = {
  onSuccess: (userId: number, username: string) => void;
};

export default function AuthModal({ onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'register',
          username: username.trim(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ошибка при выполнении запроса');
        setLoading(false);
        return;
      }

      if (data.success) {
        localStorage.setItem('userId', data.userId.toString());
        localStorage.setItem('username', data.username);
        onSuccess(data.userId, data.username);
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm border-border/50">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Users" size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {isLogin ? 'Вход в чат 5У' : 'Регистрация'}
            </h2>
            <p className="text-muted-foreground">
              {isLogin ? 'Войдите, чтобы общаться с классом' : 'Создайте свой никнейм'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Никнейм"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background/50"
                minLength={3}
                maxLength={50}
                required
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50"
                minLength={6}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/50 flex items-center gap-2">
                <Icon name="AlertCircle" size={18} className="text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Загрузка...
                </>
              ) : (
                isLogin ? 'Войти' : 'Зарегистрироваться'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
