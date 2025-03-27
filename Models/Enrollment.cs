namespace StudentPortal.Models
{
    public class Enrollment
    {
        public int EnrollmentId { get; set; }
        public int StudentId { get; set; } // Required
        public int CourseId { get; set; }  // Required
        public DateTime EnrollmentDate { get; set; }

        // Navigation properties (not required for POST)
        public Student? Student { get; set; }
        public Course? Course { get; set; }
    }
}
