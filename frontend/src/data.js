// src/data.js
export const PRIMARY_COLOR = "#F7A823"; // El naranja cálido del logo
export const SECONDARY_COLOR = "#2D2D2D"; // Un gris casi negro para elegancia y profundidad
export const HOVER_COLOR = "#D48C19";

export const categoriasCursos = [
    { 
        id: "hermeneutica-biblica-avanzada",
        title: "Hermeneútica Bíblica Avanzada",
        instructor: "Dr. Alberto Smith", 
        rating: 4.9,
        reviews: "1,240",
        price: "169",
        oldPrice: "299",
        isBestseller: true,
        updatedDate: "diciembre de 2025",
        totalHours: "45",
        level: "Avanzado",
        description: "Domina las herramientas exegéticas necesarias para extraer el significado original de las Escrituras y aplicarlo fielmente hoy.",
        objectives: [
            "Dominar el método histórico-gramatical",
            "Identificar falacias interpretativas comunes",
            "Analizar la estructura quiástica en los Salmos"
        ],
        image: "/imagenes/teologia.jpg"
    },
    { 
        id: "liderazgo-etico-mercado",
        title: "Liderazgo Ético en el Mercado",
        instructor: "Dr. Diego Avila", 
        rating: 4.8,
        reviews: "1,500",
        price: "189",
        oldPrice: "350",
        isBestseller: true,
        updatedDate: "noviembre de 2025",
        totalHours: "32",
        level: "Intermedio",
        description: "Cómo ser luz en el mundo empresarial aplicando principios bíblicos de integridad y servicio en equipos de alto rendimiento.",
        objectives: [
            "Desarrollar una visión bíblica del trabajo",
            "Gestión de conflictos bajo principios de Mateo 18",
            "Estrategias de mentoría para nuevos líderes"
        ],
        image: "/imagenes/certificado-informacion.jpg" 
    },
    { 
        id: "genesis-origenes-fe",
        title: "Génesis: Los Orígenes de nuestra Fe",
        instructor: "C.S. Lewis (Estudio)", 
        rating: 5.0,
        reviews: "2,000",
        price: "149",
        oldPrice: "299",
        isBestseller: false,
        updatedDate: "octubre de 2025",
        totalHours: "50",
        level: "Principiante",
        description: "Un viaje profundo desde la creación hasta la formación del pueblo del pacto, explorando la soberanía de Dios.",
        objectives: [
            "Comprender el concepto de Imago Dei",
            "Estudiar los pactos abrahámicos",
            "Analizar la tipología de Cristo en Génesis"
        ],
        image: "/imagenes/teologia-hombre.jpg" 
    },
    { 
        id: "teologia-sistematica-01",
        title: "Introducción a la Teología Sistemática",
        instructor: "Dra. Elena Rodríguez", 
        rating: 4.7,
        reviews: "850",
        price: "199",
        oldPrice: "399",
        isBestseller: true,
        updatedDate: "diciembre de 2025",
        totalHours: "60",
        level: "Intermedio",
        description: "Organiza tu fe. Un estudio ordenado sobre la doctrina de Dios, el hombre, el pecado y la salvación.",
        objectives: [
            "Definir los atributos comunicables de Dios",
            "Estudiar la doctrina de la justificación",
            "Diferenciar entre gracia común y especial"
        ],
        image: "/imagenes/certificado-informatica.jpg" 
    }
];