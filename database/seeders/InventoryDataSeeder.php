<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InventoryDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();

        try {
            // Clear existing data with PostgreSQL syntax
            DB::statement('TRUNCATE TABLE inventory_category CASCADE');
            DB::statement('TRUNCATE TABLE inventory CASCADE');
            DB::statement('TRUNCATE TABLE categories CASCADE');
            DB::statement('TRUNCATE TABLE offices CASCADE');
            DB::statement('TRUNCATE TABLE faculty CASCADE');

            // Reset PostgreSQL sequences
            DB::statement('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
            DB::statement('ALTER SEQUENCE offices_id_seq RESTART WITH 1');
            DB::statement('ALTER SEQUENCE faculty_id_seq RESTART WITH 1');
            DB::statement('ALTER SEQUENCE inventory_id_seq RESTART WITH 1');

            // Seed categories
            DB::table('categories')->insert([
                ['id' => 1, 'name' => 'AB Power Engineering', 'created_at' => '2025-07-15 17:30:22', 'updated_at' => '2025-07-15 17:30:22'],
                ['id' => 2, 'name' => 'Renewable Energy for AB Applications', 'created_at' => '2025-07-15 17:30:22', 'updated_at' => '2025-07-15 17:30:22'],
                ['id' => 3, 'name' => 'AB Machinery and Mechanization', 'created_at' => '2025-07-15 17:36:25', 'updated_at' => '2025-07-15 17:36:25'],
                ['id' => 4, 'name' => 'Machine Design for AB Production', 'created_at' => '2025-07-15 17:36:35', 'updated_at' => '2025-07-15 17:36:40'],
                ['id' => 5, 'name' => 'AB Structures and Environment Engineering', 'created_at' => '2025-07-15 17:36:48', 'updated_at' => '2025-07-15 17:36:48'],
                ['id' => 6, 'name' => 'Plant and Livestock Environmental Engineering', 'created_at' => '2025-07-15 17:36:56', 'updated_at' => '2025-07-15 17:36:56'],
                ['id' => 7, 'name' => 'AB Electrification and Control Systems', 'created_at' => '2025-07-15 17:37:01', 'updated_at' => '2025-07-15 17:37:01'],
                ['id' => 8, 'name' => 'AB Waste Engineering', 'created_at' => '2025-07-15 17:37:15', 'updated_at' => '2025-07-15 17:37:15'],
                ['id' => 9, 'name' => 'Hydrometeorology', 'created_at' => '2025-07-15 17:37:20', 'updated_at' => '2025-07-15 17:37:20'],
                ['id' => 10, 'name' => 'Irrigation and Drainage Engineering', 'created_at' => '2025-07-15 17:37:25', 'updated_at' => '2025-07-15 17:37:25'],
                ['id' => 11, 'name' => 'Land and Water Conservation Engineering', 'created_at' => '2025-07-15 17:37:38', 'updated_at' => '2025-07-15 17:37:38'],
                ['id' => 12, 'name' => 'Aquaculture Engineering', 'created_at' => '2025-07-15 17:37:44', 'updated_at' => '2025-07-15 17:37:44'],
                ['id' => 13, 'name' => 'Properties of AB Materials', 'created_at' => '2025-07-15 17:37:46', 'updated_at' => '2025-07-15 17:37:55'],
                ['id' => 14, 'name' => 'AB Products Processing and Storage', 'created_at' => '2025-07-15 17:38:06', 'updated_at' => '2025-07-15 17:38:06'],
                ['id' => 15, 'name' => 'Food Process Engineering', 'created_at' => '2025-07-15 17:38:16', 'updated_at' => '2025-07-15 17:38:16'],
                ['id' => 16, 'name' => 'Design and Management of AB Processing Systems', 'created_at' => '2025-07-15 17:38:22', 'updated_at' => '2025-07-15 17:38:22'],
                ['id' => 17, 'name' => 'Other Materials/ Equipments Available in DABE', 'created_at' => '2025-07-15 17:38:25', 'updated_at' => '2025-07-15 17:38:25']
            ]);

            // Seed offices
            DB::table('offices')->insert([
                ['id' => 1, 'office_name' => 'Old Farm Mech Building', 'created_at' => '2025-07-15 17:23:38', 'updated_at' => '2025-07-15 17:23:38'],
                ['id' => 2, 'office_name' => 'Create', 'created_at' => '2025-07-15 17:23:38', 'updated_at' => '2025-07-15 17:23:38'],
                ['id' => 3, 'office_name' => 'New Farm Mech Building', 'created_at' => '2025-07-15 17:23:46', 'updated_at' => '2025-07-15 17:23:46'],
                ['id' => 4, 'office_name' => 'DABE', 'created_at' => '2025-07-15 17:23:55', 'updated_at' => '2025-07-15 17:23:55'],
                ['id' => 5, 'office_name' => 'CSU-ORGMS Production Area', 'created_at' => '2025-07-15 17:24:16', 'updated_at' => '2025-07-15 17:24:16'],
                ['id' => 6, 'office_name' => 'Hinang 101/Geomatics Lab/CREATE Center', 'created_at' => '2025-07-15 17:34:42', 'updated_at' => '2025-07-15 17:34:42'],
                ['id' => 7, 'office_name' => 'Hinang 109(Bioprocessing Lab)', 'created_at' => '2025-07-15 17:34:49', 'updated_at' => '2025-07-15 17:34:49'],
                ['id' => 8, 'office_name' => 'Hinang 307/ Drawing Room', 'created_at' => '2025-07-15 17:34:56', 'updated_at' => '2025-07-15 17:34:56'],
                ['id' => 9, 'office_name' => 'Hinang 301', 'created_at' => '2025-07-15 17:35:00', 'updated_at' => '2025-07-15 17:35:00'],
                ['id' => 10, 'office_name' => 'Hinang 101', 'created_at' => '2025-07-15 17:35:18', 'updated_at' => '2025-07-15 17:35:18'],
                ['id' => 11, 'office_name' => 'Geomatics Lab', 'created_at' => '2025-07-15 17:35:41', 'updated_at' => '2025-07-15 17:35:41'],
                ['id' => 12, 'office_name' => 'GE Dept.', 'created_at' => '2025-07-15 17:35:50', 'updated_at' => '2025-07-15 17:35:50']
            ]);

            // Seed faculty
            DB::table('faculty')->insert([
                ['id' => 1, 'name' => 'Others', 'office_id' => 1, 'email' =>1, 'create@carsu.edu.ph', 'phone' => null, 'created_at' => '2025-07-20 17:06:08', 'updated_at' => '2025-07-20 21:01:24'],
                ['id' => 2, 'name' => 'Aljon E. Bocobo', 'office_id' => 2, 'email' => 'create@carsu.edu.ph', 'phone' => null, 'created_at' => '2025-07-20 17:06:08', 'updated_at' => '2025-07-20 21:01:24'],
                ['id' => 3, 'name' => 'Neil Caesar M. Tado', 'office_id' => 4, 'email' => null, 'phone' => null, 'created_at' => '2025-07-20 21:01:15', 'updated_at' => '2025-07-20 21:01:15'],
                ['id' => 4, 'name' => 'May Rose B. Osoteo', 'office_id' => 4, 'email' => null, 'phone' => null, 'created_at' => '2025-07-20 21:02:17', 'updated_at' => '2025-07-20 21:02:17'],
                ['id' => 5, 'name' => 'Joan J. Sanchez', 'office_id' => 4, 'email' => null, 'phone' => null, 'created_at' => '2025-07-20 21:03:26', 'updated_at' => '2025-07-20 21:03:26'],
                ['id' => 6, 'name' => 'Cindy May Belivestre', 'office_id' => 4, 'email' => null, 'phone' => null, 'created_at' => '2025-07-20 21:03:58', 'updated_at' => '2025-07-20 21:03:58'],
                ['id' => 7, 'name' => 'Arnold D. Gemida Apdohan', 'office_id' => 4, 'email' => null, 'phone' => null, 'created_at' => '2025-07-20 21:04:34', 'updated_at' => '2025-07-20 21:04:34'],
                ['id' => 8, 'name' => 'Ana Marie Pondog Sajonia', 'office_id' => 4, 'email' => null, 'phone' => null, 'created_at' => '2025-07-20 21:05:20', 'updated_at' => '2025-07-20 21:05:20']
            ]);

            // Seed inventory
            DB::table('inventory')->insert([
                ['id' => 1, 'equipment_name' => 'Single Cylinder Diesel Engine', 'serial_number' => 'Yanmar: 572436', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 1, 'office_id' => 1, 'faculty_id' => 1, 'created_at' => null, 'updated_at' => '2025-07-27 16:47:29'],
                ['id' => 2, 'equipment_name' => 'Single Cylinder Diesel Engine', 'serial_number' => 'Swan: 4/99', 'date_acquired' => null, 'notes' => null, 'remarks' => 'Functional', 'category_id' => 1, 'office_id' => 1, 'faculty_id' => 1, 'created_at' => null, 'updated_at' => '2025-07-27 16:47:33'],
                // Add remaining inventory items here...
            ]);

            // Seed inventory_category relationships
            DB::table('inventory_category')->insert([
                ['inventory_id' => 1, 'category_id' => 1, 'created_at' => null, 'updated_at' => null],
                ['inventory_id' => 1, 'category_id' => 3, 'created_at' => null, 'updated_at' => null],
                ['inventory_id' => 2, 'category_id' => 1, 'created_at' => null, 'updated_at' => null],
                ['inventory_id' => 2, 'category_id' => 3, 'created_at' => null, 'updated_at' => null],
                // Add remaining inventory_category relationships here...
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
