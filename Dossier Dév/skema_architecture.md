# SKEMA --- ARCHITECTURE GLOBALE

## 1. STACK

-   Mobile app : Expo (iOS / Android uniquement)
-   Auth : Firebase Auth
-   Base : Firestore
-   Fichiers : Firebase Storage
-   API : Vercel Functions
-   Email : Resend

------------------------------------------------------------------------

## 2. MODULES MÉTIER

-   Facteurs
-   Photovoltaïque
-   Borne
-   Circuits de sécurité

→ Un moteur de dossier générique

------------------------------------------------------------------------

## 3. COLLECTIONS FIRESTORE

### users/{uid}

-   email
-   display_name
-   company_name
-   phone
-   role
-   logo_url
-   created_at
-   updated_at

### document_drafts/{draftId}

-   owner_uid
-   module
-   status
-   client
-   organism
-   installer_snapshot
-   payload
-   signature
-   pdf
-   created_at
-   updated_at

### documents/{documentId}

-   owner_uid
-   draft_id
-   module
-   client
-   organism
-   installer_snapshot
-   payload
-   signature
-   pdf
-   created_at

### organisms/{id}

-   name
-   address
-   phone
-   email
-   approval_number

### activity_logs/{id}

-   uid
-   action
-   target_type
-   target_id
-   created_at

### analytics_events/{id}

-   uid
-   event_name
-   payload
-   created_at

------------------------------------------------------------------------

## 4. STRUCTURE DOSSIER

client: - name - address - email - phone

organism: - name - address - phone - email

installer_snapshot: - name - company - logo_url

signature: - enabled - signer_name - signed_at - storage_path -
download_url

pdf: - storage_path - download_url

payload: → spécifique module

------------------------------------------------------------------------

## 5. STORAGE

-   users/{uid}/logo/
-   users/{uid}/signatures/
-   users/{uid}/documents/{module}/

------------------------------------------------------------------------

## 6. API VERCEL

-   generate PDF
-   send email (Resend)
-   logs
-   organismes

------------------------------------------------------------------------

## 7. ABONNEMENTS (IMPORTANT)

Ajouter dans users :

-   plan (free, pro, enterprise)
-   subscription_status
-   stripe_customer_id
-   stripe_subscription_id
-   current_period_end

Règles : - accès app bloqué si abonnement inactif - vérification côté
API

Paiement recommandé : → Stripe

------------------------------------------------------------------------

## 8. VARIABLES

Mobile : - EXPO_PUBLIC_FIREBASE\_\* - EXPO_PUBLIC_API_BASE_URL

API : - FIREBASE_PRIVATE_KEY - RESEND_API_KEY - STRIPE_SECRET_KEY

------------------------------------------------------------------------

## 9. RÈGLES

-   Firestore = vérité
-   Storage = fichiers
-   API = sécurité
-   App = UI uniquement

------------------------------------------------------------------------

## 10. OBJECTIF

Application vendable, stable, scalable
