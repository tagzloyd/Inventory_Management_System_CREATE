<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // All factory calls are commented out or removed for production safety

        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Clear existing data
        DB::table('categories')->truncate();
        DB::table('offices')->truncate();
        DB::table('faculty')->truncate();
        DB::table('inventory')->truncate();
        DB::table('inventory_category')->truncate();
        DB::table('schedules')->truncate();
        DB::table('users')->truncate();

        // Seed categories
        $categories = [
            ['id' => 1, 'name' => 'AB Power Engineering'],
            ['id' => 2, 'name' => 'Renewable Energy for AB Applications'],
            ['id' => 3, 'name' => 'AB Machinery and Mechanization'],
            ['id' => 4, 'name' => 'Machine Design for AB Production'],
            ['id' => 5, 'name' => 'AB Structures and Environment Engineering'],
            ['id' => 6, 'name' => 'Plant and Livestock Environmental Engineering'],
            ['id' => 7, 'name' => 'AB Electrification and Control Systems'],
            ['id' => 8, 'name' => 'AB Waste Engineering'],
            ['id' => 9, 'name' => 'Hydrometeorology'],
            ['id' => 10, 'name' => 'Irrigation and Drainage Engineering'],
            ['id' => 11, 'name' => 'Land and Water Conservation Engineering'],
            ['id' => 12, 'name' => 'Aquaculture Engineering'],
            ['id' => 13, 'name' => 'Properties of AB Materials'],
            ['id' => 14, 'name' => 'AB Products Processing and Storage'],
            ['id' => 15, 'name' => 'Food Process Engineering'],
            ['id' => 16, 'name' => 'Design and Management of AB Processing Systems'],
            ['id' => 17, 'name' => 'Other Materials/ Equipments Available in DABE'],
        ];
        DB::table('categories')->insert($categories);

        // Seed offices
        $offices = [
            ['id' => 1, 'office_name' => 'Old Farm Mech Laboratory'],
            ['id' => 2, 'office_name' => 'Create'],
            ['id' => 3, 'office_name' => 'New Farm Mech Building'],
            ['id' => 4, 'office_name' => 'DABE'],
            ['id' => 5, 'office_name' => 'CSU-ORGMS Production Area'],
            ['id' => 6, 'office_name' => 'Hinang 101/Geomatics Lab/CREATE Center'],
            ['id' => 7, 'office_name' => 'Hinang 109(Bioprocessing Lab)'],
            ['id' => 8, 'office_name' => 'Hinang 307/ Drawing Room'],
            ['id' => 9, 'office_name' => 'Hinang 301'],
            ['id' => 10, 'office_name' => 'Hinang 101'],
            ['id' => 11, 'office_name' => 'Geomatics Lab'],
            ['id' => 12, 'office_name' => 'GE Dept.'],
        ];
        DB::table('offices')->insert($offices);

        // Seed faculty
        $faculty = [
            ['id' => 1, 'name' => 'Others', 'office_id' => 1, 'email' => null, 'phone' => null],
            ['id' => 2, 'name' => 'Aljon E. Bocobo', 'office_id' => 2, 'email' => 'create@carsu.edu.ph', 'phone' => null],
            ['id' => 3, 'name' => 'Neil Caesar M. Tado', 'office_id' => 4, 'email' => null, 'phone' => null],
            ['id' => 4, 'name' => 'May Rose B. Osoteo', 'office_id' => 4, 'email' => null, 'phone' => null],
            ['id' => 5, 'name' => 'Joan J. Sanchez', 'office_id' => 4, 'email' => null, 'phone' => null],
            ['id' => 6, 'name' => 'Cindy May Belivestre', 'office_id' => 4, 'email' => null, 'phone' => null],
            ['id' => 7, 'name' => 'Arnold D. Gemida Apdohan', 'office_id' => 4, 'email' => null, 'phone' => null],
            ['id' => 8, 'name' => 'Ana Marie Pondog Sajonia', 'office_id' => 4, 'email' => null, 'phone' => null],
        ];
        DB::table('faculty')->insert($faculty);

        // Seed users
        $users = [
            [
                'id' => 1, 
                'name' => 'Create', 
                'email' => 'create@carsu.edu.ph', 
                'email_verified_at' => null, 
                'password' => Hash::make('password'), 
                'remember_token' => null
            ],
            [
                'id' => 3, 
                'name' => 'Admin', 
                'email' => 'admin@carsu.edu.ph', 
                'email_verified_at' => '2025-07-21 17:27:37', 
                'password' => Hash::make('password'), 
                'remember_token' => 'J1owakIvrbUHswWeZFRLW3jrWCIsjK8oXefKtkHyPflk8pFMjVuw6i4bXTFE'
            ],
        ];
        DB::table('users')->insert($users);

        // Seed inventory
        $inventory = [
            ['id' => 1, 'equipment_name' => 'Single Cylinder Diesel Engine', 'serial_number' => 'Yanmar: 572436', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 1, 'office_id' => 1, 'faculty_id' => 1],
            ['id' => 2, 'equipment_name' => 'Single Cylinder Diesel Engine', 'serial_number' => 'Swan: 4/99', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 1, 'office_id' => 1, 'faculty_id' => 1],
            ['id' => 3, 'equipment_name' => 'Single Cylinder Diesel Engine', 'serial_number' => 'Hakata: N/A', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 1, 'office_id' => 1, 'faculty_id' => 1],
            ['id' => 4, 'equipment_name' => 'Single Cylinder Diesel Engine', 'serial_number' => 'KUWCO.N/A', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 1, 'office_id' => 1, 'faculty_id' => 1],
            ['id' => 5, 'equipment_name' => 'Single Cylinder Gasoline Engine', 'serial_number' => 'HM22023526', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 1, 'office_id' => 1, 'faculty_id' => 1],
            ['id' => 6, 'equipment_name' => 'Mechanic Tools', 'serial_number' => null, 'date_acquired' => null, 'notes' => null, 'remarks' => 'Non-Functional', 'category_id' => 1, 'office_id' => 1, 'faculty_id' => 1],
            ['id' => 7, 'equipment_name' => 'Tachometer', 'serial_number' => 'N1036611-2', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Non-Functional', 'category_id' => 1, 'office_id' => 2, 'faculty_id' => 2],
            ['id' => 8, 'equipment_name' => 'Single Cylinder Gasoline Engine', 'serial_number' => null, 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 1, 'office_id' => 1, 'faculty_id' => 1],
            ['id' => 9, 'equipment_name' => 'Single Cylinder Diesel Engine', 'serial_number' => null, 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 1, 'office_id' => 1, 'faculty_id' => 1],
            ['id' => 10, 'equipment_name' => 'Two-wheel tractor', 'serial_number' => null, 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 1, 'office_id' => 5, 'faculty_id' => 1],
            ['id' => 11, 'equipment_name' => 'Four-wheel tractor', 'serial_number' => null, 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 1, 'office_id' => 3, 'faculty_id' => 1],
            ['id' => 12, 'equipment_name' => 'Electric motors', 'serial_number' => null, 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 1, 'office_id' => 3, 'faculty_id' => 1],
            ['id' => 13, 'equipment_name' => 'Solar Meter', 'serial_number' => 'CEGS-22-76', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 2, 'office_id' => 2, 'faculty_id' => 1],
            ['id' => 14, 'equipment_name' => 'Digital anemometer', 'serial_number' => '028766', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 2, 'office_id' => 2, 'faculty_id' => 1],
            ['id' => 15, 'equipment_name' => 'e Anemometer and Differential M4', 'serial_number' => '28766', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 2, 'office_id' => 10, 'faculty_id' => 1],
            ['id' => 16, 'equipment_name' => 'Digital Hot Wire Anemometer Kit', 'serial_number' => 'A.058332', 'date_acquired' => '06/25/23', 'notes' => null, 'remarks' => 'Functional', 'category_id' => 2, 'office_id' => 4, 'faculty_id' => 3],
            ['id' => 17, 'equipment_name' => 'Desktop Computers', 'serial_number' => null, 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 2, 'office_id' => 10, 'faculty_id' => 1],
            ['id' => 18, 'equipment_name' => 'Bomb Calorimeter', 'serial_number' => null, 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 2, 'office_id' => 2, 'faculty_id' => 1],
            ['id' => 19, 'equipment_name' => 'Plastic Container 201', 'serial_number' => null, 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 2, 'office_id' => 1, 'faculty_id' => 1],
            ['id' => 20, 'equipment_name' => 'Graduated Cylinder 500 ml', 'serial_number' => null, 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 2, 'office_id' => 2, 'faculty_id' => 1],
            ['id' => 21, 'equipment_name' => 'Graduated Cylinder 250ml', 'serial_number' => null, 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 2, 'office_id' => 2, 'faculty_id' => 1],
            ['id' => 22, 'equipment_name' => '2 Digital Balance', 'serial_number' => 'JN20220630001', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 2, 'office_id' => 2, 'faculty_id' => 1],
            ['id' => 23, 'equipment_name' => 'Analytical Balance', 'serial_number' => '220704075', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 2, 'office_id' => 2, 'faculty_id' => 1],
            ['id' => 24, 'equipment_name' => 'Top Loading Balance', 'serial_number' => 'CEIT-18-973', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 2, 'office_id' => 2, 'faculty_id' => 1],
            ['id' => 25, 'equipment_name' => 'Mechanic Tools', 'serial_number' => null, 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => null, 'office_id' => 1, 'faculty_id' => 1],
            ['id' => 26, 'equipment_name' => 'Photo Digital Tachometer', 'serial_number' => '187501', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => null, 'office_id' => 2, 'faculty_id' => 1],
            ['id' => 28, 'equipment_name' => 'Top Loading Balance', 'serial_number' => 'D465531824', 'date_acquired' => '6/26/2002', 'notes' => '09/10/2024 - Found at CREATE', 'remarks' => 'Functional', 'category_id' => null, 'office_id' => 4, 'faculty_id' => 3],
            ['id' => 29, 'equipment_name' => 'Laboratory Oven', 'serial_number' => null, 'date_acquired' => '01/14/2021', 'notes' => null, 'remarks' => 'Functional', 'category_id' => null, 'office_id' => 7, 'faculty_id' => 3],
            ['id' => 30, 'equipment_name' => 'Thermocouple Extension Wire', 'serial_number' => 'CREATE-0032', 'date_acquired' => '06/26/20', 'notes' => null, 'remarks' => 'Functional', 'category_id' => null, 'office_id' => 2, 'faculty_id' => 3],
            ['id' => 31, 'equipment_name' => 'Water Quality Testing Kit Biobase Model', 'serial_number' => '22A 106489', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => null, 'office_id' => 2, 'faculty_id' => 3],
        ];
        DB::table('inventory')->insert($inventory);

        // Seed inventory_category relationships
        $inventoryCategories = [
            ['inventory_id' => 1, 'category_id' => 1],
            ['inventory_id' => 1, 'category_id' => 3],
            ['inventory_id' => 2, 'category_id' => 1],
            ['inventory_id' => 2, 'category_id' => 3],
            ['inventory_id' => 3, 'category_id' => 1],
            ['inventory_id' => 3, 'category_id' => 3],
            ['inventory_id' => 4, 'category_id' => 1],
            ['inventory_id' => 4, 'category_id' => 3],
            ['inventory_id' => 5, 'category_id' => 1],
            ['inventory_id' => 5, 'category_id' => 3],
            ['inventory_id' => 6, 'category_id' => 1],
            ['inventory_id' => 7, 'category_id' => 1],
            ['inventory_id' => 8, 'category_id' => 1],
            ['inventory_id' => 9, 'category_id' => 1],
            ['inventory_id' => 10, 'category_id' => 1],
            ['inventory_id' => 11, 'category_id' => 1],
            ['inventory_id' => 12, 'category_id' => 1],
            ['inventory_id' => 13, 'category_id' => 2],
            ['inventory_id' => 14, 'category_id' => 2],
            ['inventory_id' => 15, 'category_id' => 2],
            ['inventory_id' => 16, 'category_id' => 2],
            ['inventory_id' => 17, 'category_id' => 2],
            ['inventory_id' => 18, 'category_id' => 2],
            ['inventory_id' => 19, 'category_id' => 2],
            ['inventory_id' => 20, 'category_id' => 2],
            ['inventory_id' => 20, 'category_id' => 3],
            ['inventory_id' => 21, 'category_id' => 2],
            ['inventory_id' => 22, 'category_id' => 2],
            ['inventory_id' => 23, 'category_id' => 2],
            ['inventory_id' => 24, 'category_id' => 2],
            ['inventory_id' => 25, 'category_id' => 3],
            ['inventory_id' => 26, 'category_id' => 3],
            ['inventory_id' => 28, 'category_id' => 2],
            ['inventory_id' => 29, 'category_id' => 10],
            ['inventory_id' => 30, 'category_id' => 15],
            ['inventory_id' => 31, 'category_id' => 17],
        ];
        DB::table('inventory_category')->insert($inventoryCategories);

        // Seed schedules
        $schedules = [
            ['id' => 1, 'name' => 'Loyd N. Tagaro', 'inventory_id' => 1, 'schedule_date' => '2025-07-21', 'status' => 'Completed', 'description' => 'For Killing frog'],
            ['id' => 3, 'name' => 'Jose Marie Chan', 'inventory_id' => 23, 'schedule_date' => '2025-07-21', 'status' => 'Cancelled', 'description' => 'For Christmas Party'],
            ['id' => 5, 'name' => 'Loyd N. Tagaro', 'inventory_id' => 29, 'schedule_date' => '2025-07-23', 'status' => 'Completed', 'description' => 'For Lab'],
            ['id' => 7, 'name' => 'Engr. Aljon E. Bocobo', 'inventory_id' => 17, 'schedule_date' => '2025-06-30', 'status' => 'Scheduled', 'description' => null],
        ];
        DB::table('schedules')->insert($schedules);

        // Enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $this->command->info('Database seeded successfully!');
    }
}
