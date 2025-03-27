namespace StudentPortal.Models
{
    public class Course
    {
        public int CourseId { get; set; }
        public string CourseName { get; set; }
        public string Description { get; set; }

        // Initialize Enrollments to an empty list
        public List<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}
