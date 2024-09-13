package entity

import "gorm.io/gorm"

type Postwork struct {
    gorm.Model
    IDuser uint `json:"id_user"`
    IDwork uint `json:"id_work"`
    
    // Define the foreign key relationships
    User Users `gorm:"foreignKey:IDuser;references:ID"`
    Work Work `gorm:"foreignKey:IDwork;references:ID"`
}
