// src/pages/SecurityQuestion/index.tsx
import React, { Suspense } from "react";
import { useUiLibrary } from "../../context/UiLibraryContext";

// Carga diferida de las implementaciones según la librería UI
const SecurityQuestionsTailwind = React.lazy(() => import("./securityQuestion.tailwind"));
const SecurityQuestionsBootstrap = React.lazy(() => import("./securityQuestion.bootstrap"));
const SecurityQuestionsMui = React.lazy(() => import("./securityQuestion.mui"));

const SecurityQuestions: React.FC = () => {
  const { library } = useUiLibrary();

  // Selecciona el componente según la librería UI elegida
  const Component: React.LazyExoticComponent<React.ComponentType<any>> = 
    library === "bootstrap" ? SecurityQuestionsBootstrap :
    library === "mui" ? SecurityQuestionsMui :
    SecurityQuestionsTailwind; // Por defecto usa Tailwind

  return (
    <Suspense 
      fallback={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}>
          <div>Cargando implementación...</div>
        </div>
      }
    >
      <Component />
    </Suspense>
  );
};

// Exporta el componente principal de preguntas de seguridad
export default SecurityQuestions;