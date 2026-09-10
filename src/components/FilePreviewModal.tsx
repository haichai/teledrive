import React from 'react';
import {
  X,
  Download,
  Send,
  Share2,
  Lock,
  Star,
  Trash2,
  FileText,
  Calendar,
  HardDrive,
  ExternalLink,
  ShieldCheck,
  Hash,
  Copy,
  Check
} from 'lucide-react';
import { DriveFile, Language } from '../types';
import { formatFileSize, formatDate } from '../services/storage';
import { translations } from '../services/i18n';

interface FilePreviewModalProps {
  file: DriveFile | null;
  onClose: () => void;
  onDownload: (file: DriveFile) => void;
  onForward: (file: DriveFile) => void;
  onShare: (file: DriveFile) => void;
  onToggleStar: (file: DriveFile) => void;
  lang: Language;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose,
  onDownload,
  onForward,
  onShare,
  onToggleStar,
  lang,
}) => {
  const [copiedId, setCopiedId] = React.useState(false);
  if (!file) return null;

  const t = translations[lang];

  const copyMessageId = () => {
    navigator.clipboard.writeText(file.telegramMessageId.toString());
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border flex flex-col md:flex-row bg-white border-slate-200 dark:bg-[#111928] dark:border-slate-800 animate-in zoom-in-95 duration-150">
        {/* Left: Preview Canvas */}
        <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-4 min-h-[320px] md:min-h-[480px] relative overflow-hidden">
          {file.category === 'image' && file.previewUrl ? (
            <img
              src={file.previewUrl}
              alt={file.name}
              className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-lg"
            />
          ) : file.category === 'video' && file.previewUrl ? (
            <div className="w-full max-w-2xl flex flex-col items-center">
              <video
                src={file.previewUrl}
                controls
                className="max-h-[65vh] max-w-full rounded-xl shadow-2xl bg-black"
              />
              <span className="text-xs text-slate-400 mt-2 font-mono">
                {file.name} ({formatFileSize(file.size)})
              </span>
            </div>
          ) : file.category === 'video' ? (
            <div className="w-full max-w-lg aspect-video bg-black rounded-xl overflow-hidden shadow-lg flex flex-col items-center justify-center p-6 text-center text-white border border-slate-800">
              <div className="w-14 h-14 rounded-full bg-sky-600/80 flex items-center justify-center mb-3">
                <Send className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm truncate max-w-xs">{file.name}</h4>
              <p className="text-xs text-slate-400 mt-1">
                Stream MTProto Video trực tiếp từ cụm máy chủ Telegram
              </p>
              <div className="mt-4 px-3 py-1 rounded-full text-[11px] bg-slate-800 text-sky-400 font-mono">
                {formatFileSize(file.size)} • HD 1080p
              </div>
            </div>
          ) : file.category === 'audio' ? (
            <div className="w-full max-w-md p-6 bg-slate-900 rounded-2xl border border-slate-800 text-white flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-base truncate max-w-xs">{file.name}</h4>
              <p className="text-xs text-slate-400 mt-1">Telegram Audio Streamer</p>
              <audio controls className="w-full mt-5" src={file.previewUrl}>
                Trình duyệt của bạn không hỗ trợ audio thẻ HTML5.
              </audio>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 text-white">
              <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 text-sky-400 shadow-xl">
                <FileText className="w-10 h-10" />
              </div>
              <h4 className="font-bold text-base max-w-sm truncate">{file.name}</h4>
              <span className="text-xs text-slate-400 font-mono mt-1">
                {file.mimeType || 'application/octet-stream'}
              </span>
              <p className="text-xs text-slate-400 max-w-xs mt-3">
                Tệp được lưu trữ an toàn trong Telegram chat dưới dạng tài liệu không nén.
              </p>
            </div>
          )}

          {/* Floating Actions on Preview */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {file.isEncrypted && (
              <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-amber-500/90 text-white flex items-center gap-1.5 backdrop-blur-xs">
                <Lock className="w-3 h-3" />
                <span>Mã hoá AES-256</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Metadata Inspector & Actions */}
        <div className="w-full md:w-80 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111928]">
          <div className="space-y-5 overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white break-all">
                {file.name}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onDownload(file)}
                className="py-2 px-3 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.download}</span>
              </button>
              <button
                onClick={() => onForward(file)}
                className="py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.forward}</span>
              </button>
            </div>

            {/* Detailed File Specs */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="font-bold uppercase tracking-wider text-[11px] text-slate-400">
                Thông tin MTProto
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-sky-500" />
                    Telegram Msg ID:
                  </span>
                  <button
                    onClick={copyMessageId}
                    className="font-mono font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 hover:text-sky-500"
                  >
                    #{file.telegramMessageId}
                    {copiedId ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                    Kênh lưu trữ:
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                    {file.storageName}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Kích thước:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {formatFileSize(file.size)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Bảo mật:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {file.isEncrypted ? 'AES-256 End-to-End' : 'Telegram MTProto'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-slate-500 dark:text-slate-400 pt-1">
                <div className="flex justify-between">
                  <span>Ngày tải lên:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {formatDate(file.createdAt, lang)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Định dạng:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    {file.mimeType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => onShare(file)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-500" />
              <span>{t.share}</span>
            </button>

            <button
              onClick={() => onToggleStar(file)}
              className="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Star className={`w-4 h-4 ${file.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
