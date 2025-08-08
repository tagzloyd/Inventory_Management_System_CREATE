<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Clear existing users
        DB::table('users')->truncate();

        // Insert users directly
        DB::table('users')->insert([
            [
                'name' => 'Admin',
                'email' => 'admin@carsu.edu.ph',
                'password' => Hash::make('Create-Admin'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Loyd N. Tagaro',
                'email' => 'loydtagaro1@gmail.com',
                'password' => Hash::make('Tagaro-07'),
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // Clear existing categories
        DB::table('categories')->truncate();
        // Insert categories directly
        DB::table('categories')->insert([
            [
                'name' => 'AB Power Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Renewable Energy for AB Applications',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'AB Machinery and Mechanization',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Machine Design for AB Production',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'AB Structures and Environment Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Plant and Livestock Environmental Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'AB Electrification and Control Systems',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'AB Waste Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Hydrometeorology',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Irrigation and Drainage Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Land and Water Conservation Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Aquaculture Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Properties of AB Materials',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'AB Products Processing and Storage',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Food Process Engineering',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Design and Management of AB Processing Systems',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Other Materials/ Equipments Available in DABE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Clear existing offices
        DB::table('offices')->truncate();
        // Insert offices directly
        DB::table('offices')->insert([
            [
                'office_name' => 'Old Farm Mech Laboratory',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'Create',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'New Farm Mech Building',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'DABE',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'CSU-ORGMS Production Area',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name'=> 'Hinang 101/Geomatics Lab/CREATE Center',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'Hinang 109(Bioprocessing Lab)',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'Hinang 307/ Drawing Room',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'Hinang 301',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'Hinang 101',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'Geomatics Lab',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'GE Dept.',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        //Clear existing faculty
        DB::table('faculty')->truncate();
        // Insert faculty members directly
        DB::table('faculty')->insert([
            [
                'name' => 'Others',
                'office_id' => 1, // Old Farm Mech Laboratory
                'email' => null,
                'phone' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Aljun E. Bocobo',
                'office_id' => 2, // Create
                'email' => 'create@carsu.edu.ph',
                'phone' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Neil Caesar M. Tado',
                'office_id' => 4, // DABE
                'email' => null,
                'phone' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'May Rose B. Osoteo',
                'office_id' => 4, // DABE
                'email' => null,
                'phone' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Joan J. Sanchez',
                'office_id' => 4, // DABE
                'email' => null,
                'phone' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cindy May Belivestre',
                'office_id' => 4, // DABE
                'email' => null,
                'phone' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Arnold D. Gemida Apdohan',
                'office_id' => 4, // DABE
                'email' => null,
                'phone' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ana Marie Pondog Sajonia',
                'office_id' => 4, // DABE
                'email' => null,
                'phone' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        // Clear existing inventory
        DB::table('inventory')->truncate();
        // Insert inventory items directly
        $inventoryItems = [
            [
                'id' => 1,
                'equipment_name' => 'Single Cylinder Diesel Engine',
                'serial_number' => 'Yanmar: 572436',
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 1,
                'office_id' => 1,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2,
                'equipment_name' => 'Single Cylinder Diesel Engine',
                'serial_number' => 'Swan: 4/99',
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 1,
                'office_id' => 1,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 3,
                'equipment_name' => 'Single Cylinder Diesel Engine',
                'serial_number' => 'Hakata: N/A',
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 1,
                'office_id' => 1,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 4,
                'equipment_name' => 'Single Cylinder Diesel Engine',
                'serial_number' => 'KUWCO.N/A',
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 1,
                'office_id' => 1,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 5,
                'equipment_name' => 'Single Cylinder Gasoline Engine',
                'serial_number' => 'HM22023526',
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 1,
                'office_id' => 1,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 6,
                'equipment_name' => 'Mechanic Tools',
                'serial_number' => null,
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Non-Functional',
                'category_id' => 1,
                'office_id' => 1,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 7,
                'equipment_name' => 'Tachometer',
                'serial_number' => 'N1036611-2',
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Non-Functional',
                'category_id' => 1,
                'office_id' => 2,
                'faculty_id' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 8,
                'equipment_name' => 'Single Cylinder Gasoline Engine',
                'serial_number' => null,
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 1,
                'office_id' => 1,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 9,
                'equipment_name' => 'Single Cylinder Diesel Engine',
                'serial_number' => null,
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 1,
                'office_id' => 1,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 10,
                'equipment_name' => 'Two-wheel tractor',
                'serial_number' => null,
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 1,
                'office_id' => 5,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 11,
                'equipment_name' => 'Four-wheel tractor',
                'serial_number' => null,
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 1,
                'office_id' => 3,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 12,
                'equipment_name' => 'Electric motors',
                'serial_number' => null,
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 1,
                'office_id' => 3,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 13,
                'equipment_name' => 'Solar Meter',
                'serial_number' => 'CEGS-22-76',
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 2,
                'office_id' => 2,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 14,
                'equipment_name' => 'Digital anemometer',
                'serial_number' => '028766',
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 2,
                'office_id' => 2,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 15,
                'equipment_name' => 'e Anemometer and Differential M4',
                'serial_number' => '28766',
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 2,
                'office_id' => 10,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 16,
                'equipment_name' => 'Digital Hot Wire Anemometer Kit',
                'serial_number' => 'A.058332',
                'date_acquired' => '06/25/23',
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 2,
                'office_id' => 4,
                'faculty_id' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 17,
                'equipment_name' => 'Desktop Computers',
                'serial_number' => null,
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 2,
                'office_id' => 10,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 18,
                'equipment_name' => 'Bomb Calorimeter',
                'serial_number' => null,
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 2,
                'office_id' => 2,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 19,
                'equipment_name' => 'Plastic Container 201',
                'serial_number' => null,
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 2,
                'office_id' => 1,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 20,
                'equipment_name' => 'Graduated Cylinder 500 ml',
                'serial_number' => null,
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 2,
                'office_id' => 2,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 21,
                'equipment_name' => 'Graduated Cylinder 250ml',
                'serial_number' => null,
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 2,
                'office_id' => 2,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 22,
                'equipment_name' => '2 Digital Balance',
                'serial_number' => 'JN20220630001',
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 2,
                'office_id' => 2,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 23,
                'equipment_name' => 'Analytical Balance',
                'serial_number' => '220704075',
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 2,
                'office_id' => 2,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 24,
                'equipment_name' => 'Top Loading Balance',
                'serial_number' => 'CEIT-18-973',
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 2,
                'office_id' => 2,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 25,
                'equipment_name' => 'Mechanic Tools',
                'serial_number' => null,
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 3,
                'office_id' => 1,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 26,
                'equipment_name' => 'Photo Digital Tachometer',
                'serial_number' => '187501',
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 3,
                'office_id' => 2,
                'faculty_id' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 28,
                'equipment_name' => 'Top Loading Balance',
                'serial_number' => 'D465531824',
                'date_acquired' => '6/26/2002',
                'notes' => '09/10/2024 - Found at CREATE',
                'remarks' => 'Functional',
                'category_id' => 2,
                'office_id' => 4,
                'faculty_id' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 29,
                'equipment_name' => 'Laboratory Oven',
                'serial_number' => null,
                'date_acquired' => '01/14/2021',
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 10,
                'office_id' => 7,
                'faculty_id' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 30,
                'equipment_name' => 'Thermocouple Extension Wire',
                'serial_number' => 'CREATE-0032',
                'date_acquired' => '06/26/20',
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 15,
                'office_id' => 2,
                'faculty_id' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 31,
                'equipment_name' => 'Water Quality Testing Kit Biobase Model',
                'serial_number' => '22A 106489',
                'date_acquired' => null,
                'notes' => null,
                'remarks' => 'Functional',
                'category_id' => 17,
                'office_id' => 2,
                'faculty_id' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        foreach ($inventoryItems as $item) {
            DB::table('inventory')->insert($item);
        }

        // Insert inventory_category relationships
        $inventoryCategories = [
            ['inventory_id' => 1, 'category_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 1, 'category_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 2, 'category_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 2, 'category_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 3, 'category_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 3, 'category_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 4, 'category_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 4, 'category_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 5, 'category_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 5, 'category_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 6, 'category_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 7, 'category_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 8, 'category_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 9, 'category_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 10, 'category_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 11, 'category_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 12, 'category_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 13, 'category_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 14, 'category_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 15, 'category_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 16, 'category_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 17, 'category_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 18, 'category_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 19, 'category_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 20, 'category_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 20, 'category_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 21, 'category_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 22, 'category_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 23, 'category_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 24, 'category_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 25, 'category_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 26, 'category_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 28, 'category_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 29, 'category_id' => 10, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 30, 'category_id' => 15, 'created_at' => now(), 'updated_at' => now()],
            ['inventory_id' => 31, 'category_id' => 17, 'created_at' => now(), 'updated_at' => now()],
        ];
        DB::table('inventory_category')->insert($inventoryCategories);
    }
}