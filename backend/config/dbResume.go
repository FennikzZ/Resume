package config

import (
    "fmt"
    "time"
    "example.com/sa-67-example/entity"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

var db *gorm.DB

// DB returns the database connection
func DB() *gorm.DB {
    return db
}

// ConnectionDB initializes the database connection
func ConnectionDB() {
    database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
    if err != nil {
        panic("failed to connect database")
    }
    fmt.Println("connected database")
    db = database
}

// SetupDatabase sets up the database schema and populates initial data
func SetupDatabase() {
    // AutoMigrate to create/update tables
    db.AutoMigrate(
        &entity.Users{},
        &entity.Genders{},
        &entity.Personal{},
        &entity.Study{},
        &entity.Experience{},
        &entity.Skill{},
        &entity.Resume{},
    )

    // Create initial Gender records
    genderMale := entity.Genders{Gender: "Male"}
    genderFemale := entity.Genders{Gender: "Female"}
    db.FirstOrCreate(&genderMale, entity.Genders{Gender: "Male"})
    db.FirstOrCreate(&genderFemale, entity.Genders{Gender: "Female"})

    // Create initial User record
    hashedPassword, _ := HashPassword("123456")
    birthDay, _ := time.Parse("2006-01-02", "1988-11-12")
    user := &entity.Users{
        FirstName: "Software",
        LastName:  "Analysis",
        Email:     "sa@gmail.com",
        Age:       80,
        Password:  hashedPassword,
        BirthDay:  birthDay,
        GenderID:  1,
    }
    db.FirstOrCreate(user, &entity.Users{Email: "sa@gmail.com"})

     // Create sample Personal data
     personal := entity.Personal{
        FirstName:   "John",
        LastName:    "Doe",
        Address:     "123 Main St",
        Province:    "Bangkok",
        PhoneNumber: "0123456789",
        Email:       "john.doe@example.com",
        Profile:     "Experienced software developer.",
    }
    db.FirstOrCreate(&personal, entity.Personal{Email: "john.doe@example.com"})

    // Create sample Study data
    study := entity.Study{
        Education:   "Bachelor's Degree in Computer Science",
        Institution: "ABC University",
        Year:        "2010",
    }
    db.FirstOrCreate(&study, entity.Study{Education: "Bachelor's Degree in Computer Science"})

    // Create sample Experience data
    experience := entity.Experience{
        JobTitle:  "Software Developer",
        Company:   "XYZ Ltd.",
        StartDate: "2015-01-01",
        EndDate:   "2020-12-31",
    }
    db.FirstOrCreate(&experience, entity.Experience{JobTitle: "Software Developer"})

    // Create sample Skill data
    skill := entity.Skill{
        Skill1: "Go",
        Level1: 5,
        Skill2: "React",
        Level2: 4,
        Skill3: "SQL",
        Level3: 4,
    }
    db.FirstOrCreate(&skill, entity.Skill{Skill1: "Go"})

    // Create sample Resume data
    resume := entity.Resume{
        PersonalID:   personal.ID,
        StudyID:      study.ID,
        ExperienceID: experience.ID,
        SkillID:      skill.ID,
    }
    db.FirstOrCreate(&resume, entity.Resume{PersonalID: personal.ID})
}

