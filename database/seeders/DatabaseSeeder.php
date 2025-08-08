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
                'office_name' => 'Old Farm Mech Building',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'New Farm Mech Building',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'Create',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'Dabe',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'CSU-ORGMS Production Area',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name'=> 'Hinang 101',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'Hinang 109',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'Hinang 301',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'Hinang 307 / Drawing Room',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'Geomatics Laboratory',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'office_name' => 'GE Dept. Office',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        //Clear existing facilties
        DB::table('faculties')->truncate();
        // Insert faculty members directly
        DB::table('faculties')->insert([
            [
                'name' => 'Others',
                'office_id' => 1, // Old Farm Mech Building
                'email' => 'loyd.tagaro@example.com',
                'phone' => '09123456789',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Aljun E. Bocobo',
                'office_id' => 2, // New Farm Mech Building
                'email' => 'aljun.bocobo@example.com',
                'phone' => '09123456789',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
        // // Clear existing inventory
        // DB::table('inventory')->truncate();
        // // Insert inventory items directly
        // DB::table('inventory')->insert([
        //     [
        //         'name' => 'Single Cylinder Diesel Engine',
        //         'category_id' => 1, // AB Power Engineering
        //         'office_id' => 1, // Old Farm Mech Building
        //         'facility_id' => 1, // Create
        //         'serial_number' => 'DIESEL-001',
        //         'date_acquired' => null,
        //         'notes' => null,
        //         'remarks' => 'Functional',
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],

        // ]);

        // // Clear existing inventory category
        // DB::table('inventory_category')->truncate();
        // // Insert inventory categories directly
        // DB::table('inventory_category')->insert([
        //     [
        //         'inventory_id' => 1, // Single Cylinder Diesel Engine 
        //         'category_id' => 1, // AB Power Engineering
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],

        // ]);

    }
}
