import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  instructor: String,
  description: String,
  price: Number,
  oldPrice: Number,
  rating: { type: Number, default: 5 },
  reviews: { type: Number, default: 0 },
  totalHours: String,
  level: String,
  image: String,
  objectives: [String],
  category: String,
  updatedDate: String
});

const Course = mongoose.model('Course', CourseSchema);
export default Course;