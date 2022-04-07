--
-- PostgreSQL database dump
--

-- Dumped from database version 12.6 (Debian 12.6-1.pgdg100+1)
-- Dumped by pg_dump version 12.6 (Debian 12.6-1.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: trigger_set_updated_at(); Type: FUNCTION; Schema: public; Owner: chichi
--

CREATE FUNCTION public.trigger_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  BEGIN
    IF NEW IS DISTINCT FROM OLD THEN
      NEW.updated_at = now();
      RETURN NEW;
    ELSE
      RETURN OLD;
    END IF;
  END;
  $$;


ALTER FUNCTION public.trigger_set_updated_at() OWNER TO chichi;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: chichi
--

CREATE TABLE public.activities (
    id integer NOT NULL,
    user_id integer NOT NULL,
    activity_type_id integer NOT NULL,
    parameters json,
    product_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.activities OWNER TO chichi;

--
-- Name: activities_id_seq; Type: SEQUENCE; Schema: public; Owner: chichi
--

CREATE SEQUENCE public.activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.activities_id_seq OWNER TO chichi;

--
-- Name: activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chichi
--

ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;


--
-- Name: activity_types; Type: TABLE; Schema: public; Owner: chichi
--

CREATE TABLE public.activity_types (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.activity_types OWNER TO chichi;

--
-- Name: activity_types_id_seq; Type: SEQUENCE; Schema: public; Owner: chichi
--

CREATE SEQUENCE public.activity_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.activity_types_id_seq OWNER TO chichi;

--
-- Name: activity_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chichi
--

ALTER SEQUENCE public.activity_types_id_seq OWNED BY public.activity_types.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: chichi
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    description text NOT NULL,
    brand character varying(200),
    sku character varying(50) NOT NULL,
    variant_id integer NOT NULL,
    variant_name character varying(200) NOT NULL,
    color character varying(100),
    size character varying(50),
    price real NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.products OWNER TO chichi;

--
-- Name: users; Type: TABLE; Schema: public; Owner: chichi
--

CREATE TABLE public.users (
    id integer NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO chichi;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: chichi
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO chichi;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: chichi
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: activities id; Type: DEFAULT; Schema: public; Owner: chichi
--

ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);


--
-- Name: activity_types id; Type: DEFAULT; Schema: public; Owner: chichi
--

ALTER TABLE ONLY public.activity_types ALTER COLUMN id SET DEFAULT nextval('public.activity_types_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: chichi
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: chichi
--

COPY public.activities (id, user_id, activity_type_id, parameters, product_id, created_at) FROM stdin;
\.


--
-- Data for Name: activity_types; Type: TABLE DATA; Schema: public; Owner: chichi
--

COPY public.activity_types (id, name, created_at, updated_at) FROM stdin;
1	filter	2022-04-07 19:12:55.197141+00	2022-04-07 19:12:55.197141+00
2	sort	2022-04-07 19:12:55.197141+00	2022-04-07 19:12:55.197141+00
3	search	2022-04-07 19:12:55.197141+00	2022-04-07 19:12:55.197141+00
4	view	2022-04-07 19:12:55.197141+00	2022-04-07 19:12:55.197141+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: chichi
--

COPY public.products (id, name, description, brand, sku, variant_id, variant_name, color, size, price, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: chichi
--

COPY public.users (id, firstname, lastname, email, phone, created_at, updated_at) FROM stdin;
1	Philip	Rice	philip.rice79@yahoo.com	04.50.08.33.88	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
2	Maryse	Wintheiser	maryse58@hotmail.com	07.81.92.21.60	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
3	Waldo	Senger	waldo_senger38@yahoo.com	06.96.41.42.23	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
4	Georgiana	Howell	georgiana_howell@gmail.com	03.91.44.92.66	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
5	Alphonso	Bogan	alphonso.bogan32@hotmail.com	07.45.75.46.95	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
6	Cassandra	Feil	cassandra.feil2@gmail.com	05.90.60.94.18	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
7	Ignatius	Pagac	ignatius.pagac96@hotmail.com	06.90.79.32.46	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
8	Bridie	Kilback	bridie81@yahoo.com	02.41.32.82.99	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
9	Eldon	Beahan	eldon21@yahoo.com	04.12.44.25.03	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
10	Mateo	Beer	mateo.beer@hotmail.com	05.06.79.49.15	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
11	Jerrell	O'Keefe	jerrell_okeefe9@hotmail.com	08.78.61.85.81	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
12	Dane	Kub	dane81@hotmail.com	06.97.87.58.89	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
13	Cyril	Flatley	cyril.flatley60@hotmail.com	02.44.26.99.47	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
14	Heber	Yundt	heber94@gmail.com	05.26.33.00.80	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
15	Missouri	Maggio	missouri_maggio@gmail.com	04.67.49.64.28	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
16	Chadrick	Kreiger	chadrick31@hotmail.com	09.54.03.10.32	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
17	Declan	Ritchie	declan64@hotmail.com	09.18.43.48.24	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
18	Alvah	Hettinger	alvah2@gmail.com	05.63.15.34.81	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
19	Nelson	McCullough	nelson_mccullough@gmail.com	08.36.55.58.52	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
20	Vincenzo	Weber	vincenzo.weber@gmail.com	07.57.22.70.27	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
21	Zita	Heathcote	zita.heathcote@yahoo.com	06.19.25.75.99	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
22	Mikel	Hermann	mikel_hermann33@yahoo.com	02.04.31.14.55	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
23	Edward	Kling	edward.kling76@hotmail.com	07.13.89.26.70	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
24	Dayana	Koch	dayana53@gmail.com	07.74.50.06.47	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
25	Ernestina	Lang	ernestina38@gmail.com	05.23.26.16.38	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
26	Virginia	Bahringer	virginia60@hotmail.com	07.01.14.19.78	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
27	Mabelle	Halvorson	mabelle20@gmail.com	06.67.97.71.96	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
28	Rylan	Altenwerth	rylan24@yahoo.com	05.76.94.57.86	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
29	Dorothy	Treutel	dorothy_treutel@hotmail.com	06.47.81.42.66	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
30	Cecilia	Wiegand	cecilia45@yahoo.com	03.98.47.54.26	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
31	Myrna	Huel	myrna.huel88@yahoo.com	06.94.27.96.29	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
32	Rene	Wolff	rene.wolff@hotmail.com	08.18.70.29.28	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
33	Major	Donnelly	major_donnelly83@yahoo.com	05.58.70.50.43	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
34	Liliana	Parker	liliana.parker60@hotmail.com	08.54.11.45.30	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
35	Shana	Nader	shana.nader34@hotmail.com	07.35.32.60.10	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
36	Dessie	Feeney	dessie_feeney@yahoo.com	03.79.26.51.34	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
37	Opal	Lubowitz	opal.lubowitz41@hotmail.com	07.47.99.45.55	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
38	Chauncey	Rau	chauncey_rau@yahoo.com	08.13.67.06.09	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
39	Jennie	Maggio	jennie_maggio42@yahoo.com	08.36.87.87.25	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
40	Adelbert	Runolfsdottir	adelbert.runolfsdottir37@gmail.com	07.11.01.13.77	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
41	Frida	Baumbach	frida_baumbach56@yahoo.com	02.55.81.92.93	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
42	Gillian	Ondricka	gillian_ondricka6@hotmail.com	06.47.81.28.96	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
43	Fern	Emard	fern28@yahoo.com	03.61.76.82.93	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
44	Lulu	Halvorson	lulu_halvorson7@yahoo.com	06.24.35.12.93	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
45	Rozella	Runte	rozella9@yahoo.com	05.98.47.27.50	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
46	Therese	Sanford	therese37@yahoo.com	09.20.91.65.98	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
47	Salma	Ferry	salma.ferry24@yahoo.com	06.62.63.35.31	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
48	Karen	VonRueden	karen.vonrueden@gmail.com	03.33.26.39.01	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
49	Rey	Conn	rey_conn83@hotmail.com	09.39.84.84.21	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
50	Elias	Kerluke	elias7@hotmail.com	06.58.78.42.39	2022-04-07 19:12:55.239491+00	2022-04-07 19:12:55.239491+00
\.


--
-- Name: activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chichi
--

SELECT pg_catalog.setval('public.activities_id_seq', 1, false);


--
-- Name: activity_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chichi
--

SELECT pg_catalog.setval('public.activity_types_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: chichi
--

SELECT pg_catalog.setval('public.users_id_seq', 50, true);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: chichi
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: activity_types activity_types_name_key; Type: CONSTRAINT; Schema: public; Owner: chichi
--

ALTER TABLE ONLY public.activity_types
    ADD CONSTRAINT activity_types_name_key UNIQUE (name);


--
-- Name: activity_types activity_types_pkey; Type: CONSTRAINT; Schema: public; Owner: chichi
--

ALTER TABLE ONLY public.activity_types
    ADD CONSTRAINT activity_types_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: chichi
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: chichi
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: chichi
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: activity_types update_activity_types_updated_at; Type: TRIGGER; Schema: public; Owner: chichi
--

CREATE TRIGGER update_activity_types_updated_at BEFORE UPDATE ON public.activity_types FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: chichi
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();


--
-- Name: activities activities_activity_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chichi
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_activity_type_id_fkey FOREIGN KEY (activity_type_id) REFERENCES public.activity_types(id);


--
-- Name: activities activities_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chichi
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: activities activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chichi
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

