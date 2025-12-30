const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course'); // Importamos el modelo que acabamos de crear

dotenv.config();

// Datos a sembrar (Tus 4 cursos únicos)
const cursos = [
    { 
        title: "Hermeneútica Bíblica Avanzada",
        slug: "hermeneutica-biblica-avanzada",
        instructor: "Dr. Alberto Smith", 
        price: 169,
        oldPrice: 299,
        isBestseller: true,
        totalHours: "45",
        level: "Avanzado",
        description: "Domina las reglas de interpretación para profundizar en el texto sagrado con rigor académico y espiritual.",
        objectives: ["Interpretar contextos históricos", "Analizar géneros literarios", "Aplicación práctica al sermón"],
        image: "/imagenes/teologia.jpg",
        category: "Teología"
    },
    { 
        title: "Liderazgo en el Mercado Actual",
        slug: "liderazgo-mercado-cristiano",
        instructor: "Dr. Diego Avila", 
        price: 169,
        oldPrice: 299,
        isBestseller: true,
        totalHours: "30",
        level: "Intermedio",
        description: "Aprende cómo liderar masas e influir en el mundo profesional siguiendo el camino de Dios.",
        objectives: ["Ética profesional cristiana", "Gestión de equipos", "Estrategias de impacto social"],
        image: "/imagenes/certificado-informacion.jpg",
        category: "Liderazgo"
    },
    { 
        title: "Génesis: Orígenes de la Humanidad",
        slug: "genesis-origenes-humanidad",
        instructor: "C.S. Lewis", 
        price: 169,
        oldPrice: 299,
        isBestseller: true,
        totalHours: "50",
        level: "Principiante",
        description: "Un estudio profundo sobre el primer libro de la Biblia y los fundamentos de nuestra fe.",
        objectives: ["El orden de la creación", "La caída y la promesa", "Los patriarcas"],
        image: "/imagenes/teologia-hombre.jpg",
        category: "Biblia"
    },
    { 
        title: "IA aplicada al Ministerio",
        slug: "inteligencia-artificial-ministerio",
        instructor: "Ing. Roberto Peña", 
        price: 169,
        oldPrice: 299,
        isBestseller: false,
        totalHours: "20",
        level: "Intermedio",
        description: "Herramientas tecnológicas modernas para potenciar la difusión del mensaje en la era digital.",
        objectives: ["Uso ético de la IA", "Generación de contenido", "Automatización ministerial"],
        image: "/imagenes/IA-img.jpg",
        category: "IA"
    }
];

// Función para conectar y subir datos
const importarDatos = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Limpiar la base de datos antes (para no duplicar)
        await Course.deleteMany();
        console.log('🧹 Base de datos limpia...');

        // Insertar los cursos
        await Course.insertMany(cursos);
        console.log('🌱 ¡Datos sembrados con éxito!');

        process.exit();
    } catch (error) {
        console.error(`❌ Error al importar: ${error.message}`);
        process.exit(1);
    }
};

importarDatos();