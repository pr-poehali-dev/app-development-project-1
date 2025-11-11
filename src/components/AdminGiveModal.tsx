import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AdminGiveModalProps {
  onClose: () => void;
  onConfirm: (level: 'ma1' | 'sa1', targetUser: string) => void;
  currentPromocode: string;
}

export default function AdminGiveModal({ onClose, onConfirm, currentPromocode }: AdminGiveModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<'ma1' | 'sa1'>('ma1');
  const [verificationCode, setVerificationCode] = useState('');
  const [targetUsername, setTargetUsername] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!targetUsername.trim()) {
      setError('Введите имя пользователя');
      return;
    }

    if (selectedLevel === 'sa1' && verificationCode !== 'admincomplession.1') {
      setError('Неверный код доступа для старшего администратора');
      return;
    }

    onConfirm(selectedLevel, targetUsername);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Выдача админ прав
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Пользователь
            </label>
            <Input
              value={targetUsername}
              onChange={(e) => setTargetUsername(e.target.value)}
              placeholder="Введите имя пользователя"
              className="bg-white/5 border-white/10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Уровень доступа
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedLevel('ma1')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  selectedLevel === 'ma1'
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-semibold text-blue-400">admin.ma1</div>
                    <div className="text-sm text-gray-400">Младший администратор</div>
                  </div>
                  <Icon 
                    name={selectedLevel === 'ma1' ? 'CheckCircle2' : 'Circle'} 
                    size={20} 
                    className={selectedLevel === 'ma1' ? 'text-blue-400' : 'text-gray-600'}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2 text-left">
                  Добавление новостей, просмотр контактов
                </div>
              </button>

              <button
                onClick={() => setSelectedLevel('sa1')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  selectedLevel === 'sa1'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="font-semibold text-purple-400">admin.sa1</div>
                    <div className="text-sm text-gray-400">Старший администратор</div>
                  </div>
                  <Icon 
                    name={selectedLevel === 'sa1' ? 'CheckCircle2' : 'Circle'} 
                    size={20} 
                    className={selectedLevel === 'sa1' ? 'text-purple-400' : 'text-gray-600'}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2 text-left">
                  Полный доступ ко всем функциям
                </div>
              </button>
            </div>
          </div>

          {selectedLevel === 'sa1' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Код доступа
              </label>
              <Input
                type="password"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                  setError('');
                }}
                placeholder="Введите секретный код"
                className="bg-white/5 border-white/10"
              />
              <p className="text-xs text-gray-500 mt-1">
                Требуется секретный код для выдачи прав старшего администратора
              </p>
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-blue-400 mt-0.5" />
              <div className="text-xs text-gray-300">
                <div className="font-medium text-blue-400 mb-1">Текущий промокод</div>
                <code className="bg-black/30 px-2 py-1 rounded">{currentPromocode}</code>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Icon name="AlertCircle" size={16} className="text-red-400 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              Выдать права
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}