import { query } from './query';

export const createTableIfNotExists = async (): Promise<void> => {
  await query(`
    CREATE OR REPLACE FUNCTION trigger_set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW IS DISTINCT FROM OLD THEN
        NEW.updated_at = now();
        RETURN NEW;
      ELSE
        RETURN OLD;
      END IF;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      company_name VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for customers table
    DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
    CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS workshops (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for workshops table
    DROP TRIGGER IF EXISTS update_workshops_updated_at ON workshops;
    CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for suppliers table
    DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
    CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS models_suppliers (
      id SERIAL PRIMARY KEY,
      model_id INTEGER NOT NULL REFERENCES models(id) ON DELETE CASCADE,
      supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
      UNIQUE (model_id, supplier_id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for models_suppliers table
    DROP TRIGGER IF EXISTS update_models_suppliers_updated_at ON models_suppliers;
    CREATE TRIGGER update_models_suppliers_updated_at BEFORE UPDATE ON models_suppliers FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS addresses (
      id SERIAL PRIMARY KEY,
      address VARCHAR(100) NOT NULL,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      supplier_id INTEGER REFERENCES suppliers(id) ON DELETE CASCADE,
      workshop_id INTEGER REFERENCES workshops(id) ON DELETE CASCADE,
      customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
      UNIQUE (address, supplier_id),
      UNIQUE (address, workshop_id),
      UNIQUE (address, customer_id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for addresses table
    DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;
    CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    DO
    $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tu_vous_you') THEN
        CREATE TYPE tu_vous_you AS ENUM('tu', 'vous', 'you');
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      tuvousyou tu_vous_you NOT NULL,
      supplier_id INTEGER REFERENCES suppliers(id) ON DELETE CASCADE,
      workshop_id INTEGER REFERENCES workshops(id) ON DELETE CASCADE,
      customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
      UNIQUE (firstname, lastname, email, phone, supplier_id),
      UNIQUE (firstname, lastname, email, phone, workshop_id),
      UNIQUE (firstname, lastname, email, phone, customer_id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for contacts table
    DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
    CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      firstname VARCHAR(50) NOT NULL,
      lastname VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      role VARCHAR(50),
      active BOOLEAN NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for users table
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS customer_orders (
      id SERIAL PRIMARY KEY,
      contact_id INTEGER NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      deadline TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '10 DAYS',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for customer_orders table
    DROP TRIGGER IF EXISTS update_customer_orders_updated_at ON customer_orders;
    CREATE TRIGGER update_customer_orders_updated_at BEFORE UPDATE ON customer_orders FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS customer_order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES customer_orders(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for customer_order_items table
    DROP TRIGGER IF EXISTS update_customer_order_items_updated_at ON customer_order_items;
    CREATE TRIGGER update_customer_order_items_updated_at BEFORE UPDATE ON customer_order_items FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS sku_quantities (
      id SERIAL PRIMARY KEY,
      sku INTEGER NOT NULL REFERENCES products(sku) ON DELETE CASCADE,
      quantity INTEGER CONSTRAINT positive_quantity CHECK (quantity > 0) DEFAULT(1),
      customer_order_item_id INTEGER NOT NULL REFERENCES customer_order_items(id) ON DELETE CASCADE,
      delivery_address_id INTEGER NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for sku_quantities table
    DROP TRIGGER IF EXISTS update_sku_quantities_updated_at ON sku_quantities;
    CREATE TRIGGER update_sku_quantities_updated_at BEFORE UPDATE ON sku_quantities FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS techniques (
      id SERIAL PRIMARY KEY,
      name_fr VARCHAR(50) NOT NULL,
      name_en VARCHAR(50) NOT NULL,
      division_id INTEGER NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
      UNIQUE (name_fr, division_id),
      UNIQUE (name_en, division_id),
      associated_fields JSON,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for techniques table
    DROP TRIGGER IF EXISTS update_techniques_updated_at ON techniques;
    CREATE TRIGGER update_techniques_updated_at BEFORE UPDATE ON techniques FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS customer_order_customizations (
      id SERIAL PRIMARY KEY,
      technique_id INTEGER NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
      location_id INTEGER NOT NULL REFERENCES customization_locations(id) ON DELETE CASCADE,
      logo_url VARCHAR(255) NOT NULL,
      logo_dimensions VARCHAR(255) NOT NULL,
      customer_order_item_id INTEGER NOT NULL REFERENCES customer_order_items(id) ON DELETE CASCADE,
      technique_associated_data JSON,
      mockup_url VARCHAR(255),
      font_url VARCHAR(255),
      csv_url VARCHAR(255),
      comment TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for customer_order_customizations table
    DROP TRIGGER IF EXISTS update_customer_order_customizations_updated_at ON customer_order_customizations;
    CREATE TRIGGER update_customer_order_customizations_updated_at BEFORE UPDATE ON customer_order_customizations FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS workshops_techniques (
      id SERIAL PRIMARY KEY,
      workshop_id INTEGER NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
      technique_id INTEGER NOT NULL REFERENCES techniques(id) ON DELETE CASCADE,
      UNIQUE (workshop_id, technique_id),
      availability_date TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for workshops_techniques table
    DROP TRIGGER IF EXISTS update_workshops_techniques_updated_at ON workshops_techniques;
    CREATE TRIGGER update_workshops_techniques_updated_at BEFORE UPDATE ON workshops_techniques FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS workshop_orders (
      id SERIAL PRIMARY KEY,
      workshop_id INTEGER NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for workshop_orders table
    DROP TRIGGER IF EXISTS update_workshop_orders_updated_at ON workshop_orders;
    CREATE TRIGGER update_workshop_orders_updated_at BEFORE UPDATE ON workshop_orders FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS workshop_order_items (
      id SERIAL PRIMARY KEY,
      workshop_order_id INTEGER NOT NULL REFERENCES workshop_orders(id) ON DELETE CASCADE,
      customer_order_item_id INTEGER NOT NULL REFERENCES customer_order_items(id) ON DELETE CASCADE,
      UNIQUE (workshop_order_id, customer_order_item_id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for workshop_order_items table
    DROP TRIGGER IF EXISTS update_workshop_order_items_updated_at ON workshop_order_items;
    CREATE TRIGGER update_workshop_order_items_updated_at BEFORE UPDATE ON workshop_order_items FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS supplier_orders (
      id SERIAL PRIMARY KEY,
      supplier_id INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for supplier_orders table
    DROP TRIGGER IF EXISTS update_supplier_orders_updated_at ON supplier_orders;
    CREATE TRIGGER update_supplier_orders_updated_at BEFORE UPDATE ON supplier_orders FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS supplier_order_items (
      id SERIAL PRIMARY KEY,
      supplier_order_id INTEGER NOT NULL REFERENCES supplier_orders(id) ON DELETE CASCADE,
      sku_quantity_id INTEGER NOT NULL REFERENCES sku_quantities(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for supplier_order_items table
    DROP TRIGGER IF EXISTS update_supplier_order_items_updated_at ON supplier_order_items;
    CREATE TRIGGER update_supplier_order_items_updated_at BEFORE UPDATE ON supplier_order_items FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    DO
    $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transporter_plugin') THEN
        CREATE TYPE transporter_plugin AS ENUM('chronopost', 'ups');
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS transporters (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      plugin transporter_plugin,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for transporters table
    DROP TRIGGER IF EXISTS update_transporters_updated_at ON transporters;
    CREATE TRIGGER update_transporters_updated_at BEFORE UPDATE ON transporters FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS delivery_orders (
      id SERIAL PRIMARY KEY,
      "from" INTEGER NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,
      "to" INTEGER NOT NULL REFERENCES addresses(id) ON DELETE CASCADE,
      transporter_id INTEGER NOT NULL REFERENCES transporters(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for delivery_orders table
    DROP TRIGGER IF EXISTS update_delivery_orders_updated_at ON delivery_orders;
    CREATE TRIGGER update_delivery_orders_updated_at BEFORE UPDATE ON delivery_orders FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS delivery_order_items (
      id SERIAL PRIMARY KEY,
      delivery_order_id INTEGER NOT NULL REFERENCES delivery_orders(id) ON DELETE CASCADE,
      sku_quantity_id INTEGER NOT NULL REFERENCES sku_quantities(id) ON DELETE CASCADE,
      UNIQUE(delivery_order_id, sku_quantity_id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for delivery_order_items table
    DROP TRIGGER IF EXISTS update_delivery_order_items_updated_at ON delivery_order_items;
    CREATE TRIGGER update_delivery_order_items_updated_at BEFORE UPDATE ON delivery_order_items FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS parcels (
      id SERIAL PRIMARY KEY,
      delivery_order_id INTEGER NOT NULL REFERENCES delivery_orders(id) ON DELETE CASCADE,
      status VARCHAR(50) NOT NULL,
      tracking_id VARCHAR(50) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for parcels table
    DROP TRIGGER IF EXISTS update_parcels_updated_at ON parcels;
    CREATE TRIGGER update_parcels_updated_at BEFORE UPDATE ON parcels FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS draft_orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      data JSON NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for draft_orders table
    DROP TRIGGER IF EXISTS update_draft_orders_updated_at ON draft_orders;
    CREATE TRIGGER update_draft_orders_updated_at BEFORE UPDATE ON draft_orders FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      message TEXT,
      customer_order_id INTEGER REFERENCES customer_orders(id),
      workshop_order_id INTEGER REFERENCES workshop_orders(id),
      supplier_order_id INTEGER REFERENCES supplier_orders(id),
      delivery_order_id INTEGER REFERENCES delivery_orders(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for comments table
    DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
    CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      log_fr TEXT,
      log_en TEXT,
      customer_order_id INTEGER REFERENCES customer_orders(id),
      workshop_order_id INTEGER REFERENCES workshop_orders(id),
      supplier_order_id INTEGER REFERENCES supplier_orders(id),
      delivery_order_id INTEGER REFERENCES delivery_orders(id),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- updated_at for events table
    DROP TRIGGER IF EXISTS update_events_updated_at ON events;
    CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE PROCEDURE trigger_set_updated_at();
  `);
};
