using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StudentPortal.Models
{
    public class Student
    {
        public int StudentId { get; set; }

        [Required(ErrorMessage = "First Name is required")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is required")]
        public string LastName { get; set; }

        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Date of Birth is required")]
        public DateTime DateOfBirth { get; set; }

        // Initialize Enrollments to an empty list
        public List<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}