// src/pages/circularizacao/components/A4PreviewWithThumbnail.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, X } from 'lucide-react';

export default function A4PreviewWithThumbnail({
  html,
  previewType,
  setCurrentSection,
  onCloseModal, // opcional
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalScale, setModalScale] = useState(1);
  const modalContainerRef = useRef(null);
  const modalPreviewRef = useRef(null);

  // Fecha modal se o tipo da carta mudar (evita conteúdo desatualizado)
  useEffect(() => {
    setIsModalOpen(false);
  }, [previewType]);

  // Responsividade do modal (mesma lógica do antigo preview)
  useEffect(() => {
    if (!isModalOpen) return;
    const handleResize = () => {
      if (modalContainerRef.current) {
        const containerWidth = modalContainerRef.current.offsetWidth - 32;
        const a4Width = 794; // 210mm em px (aproximado)
        setModalScale(containerWidth < a4Width ? containerWidth / a4Width : 1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isModalOpen]);

  // Máscara de leitura dentro do modal
  useEffect(() => {
    if (!isModalOpen || !modalPreviewRef.current) return;
    const sections = modalPreviewRef.current.querySelectorAll('[data-section]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.getAttribute('data-section'));
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -20% 0px' }
    );
    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [isModalOpen, html, setCurrentSection]);

  // Impede rolagem do body quando modal aberto
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSection(null); // limpa máscara ao fechar
    if (onCloseModal) onCloseModal();
  };

  // Thumbnail: escala reduzida com base em largura fixa de 200px
  const thumbnailWidth = 200;
  const thumbnailHeight = (297 / 210) * thumbnailWidth; // ≈ 283px
  const thumbnailScale = thumbnailWidth / 210; // 200 / 210 ≈ 0.952

  return (
    <>
      {/* Thumbnail (clicável) */}
      <div
        className="cursor-pointer relative group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl"
        style={{ width: thumbnailWidth, height: thumbnailHeight }}
        onClick={openModal}
      >
        <div
          className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <Maximize2 size={32} className="text-white drop-shadow-lg" />
        </div>
        <div
          style={{
            width: '210mm',
            height: '297mm',
            transform: `scale(${thumbnailScale})`,
            transformOrigin: 'top left',
            pointerEvents: 'none', // impede interação
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* Modal expandido */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho do modal */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button
                onClick={closeModal}
                className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md hover:bg-white transition-colors"
              >
                <X size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Conteúdo do modal (A4 escalável) */}
            <div
              ref={modalContainerRef}
              className="w-full h-full overflow-auto flex justify-center items-center p-8"
            >
              <div
                ref={modalPreviewRef}
                className="bg-white text-gray-900 shadow-2xl origin-top transition-transform duration-300"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  transform: `scale(${modalScale})`,
                }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}