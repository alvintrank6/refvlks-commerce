CREATE TABLE `inventory` (
	`sku` text PRIMARY KEY NOT NULL,
	`stock` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`name` text NOT NULL,
	`contact` text NOT NULL,
	`topic` text NOT NULL,
	`order_number` text,
	`body` text NOT NULL,
	`locale` text NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`sku` text NOT NULL,
	`name` text NOT NULL,
	`colour` text NOT NULL,
	`qty` integer NOT NULL,
	`unit_price` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`number` text NOT NULL,
	`created_at` text NOT NULL,
	`locale` text NOT NULL,
	`status` text NOT NULL,
	`payment_method` text NOT NULL,
	`delivery` text NOT NULL,
	`customer_name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`address` text,
	`city` text,
	`subtotal` integer NOT NULL,
	`shipping_fee` integer NOT NULL,
	`total` integer NOT NULL,
	`customer_marked_paid_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_token_unique` ON `orders` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_number_unique` ON `orders` (`number`);--> statement-breakpoint
CREATE TABLE `studio_visits` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`visit_date` text NOT NULL,
	`visit_time` text NOT NULL,
	`bag` text,
	`note` text,
	`locale` text NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `visits_slot_unique` ON `studio_visits` (`visit_date`,`visit_time`);
--> statement-breakpoint
CREATE TRIGGER `order_item_reserve_inventory`
BEFORE INSERT ON `order_items`
BEGIN
  SELECT RAISE(ABORT, 'OUT_OF_STOCK')
  WHERE NEW.qty < 1 OR NOT EXISTS (
    SELECT 1 FROM inventory WHERE sku = NEW.sku AND stock >= NEW.qty
  );
  UPDATE inventory SET stock = stock - NEW.qty WHERE sku = NEW.sku;
END;
