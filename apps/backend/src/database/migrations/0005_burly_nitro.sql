ALTER TABLE "users" ADD COLUMN "name" varchar(255) DEFAULT 'User' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "login_id" varchar(255) DEFAULT 'ADMIN001' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "register_number" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "employee_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "department_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "program_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "academic_year_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "must_change_password" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_by" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_academic_year_id_academic_years_id_fk" FOREIGN KEY ("academic_year_id") REFERENCES "public"."academic_years"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_login_id_unique" UNIQUE("login_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_register_number_unique" UNIQUE("register_number");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_employee_id_unique" UNIQUE("employee_id");