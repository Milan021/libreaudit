import json
from supabase import create_client

# ============================================
# CONFIGURATION - REMPLACE PAR TES VALEURS
# ============================================

SUPABASE_URL = "https://xxxx.supabase.co"  # ← REMPLACE par ton URL
SUPABASE_KEY = "eyJhbG..."  # ← REMPLACE par ta service_role key

# ============================================
# NE RIEN MODIFIER EN DESSOUS
# ============================================

def main():
    # Charger le JSON
    print("Chargement du JSON...")
    with open('libreaudit_base_complete.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Connecter Supabase
    print("Connexion Supabase...")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # 1. Catégories
    print("\n→ Import des catégories...")
    categories = data['categories']
    for cat in categories:
        try:
            supabase.table('categories').insert({
                'id': cat['id'],
                'nom': cat['nom'],
                'description': cat['description'],
                'enjeux_souverainete': cat['enjeux_souverainete']
            }).execute()
        except Exception as e:
            print(f"  ⚠️ Erreur catégorie {cat['id']}: {e}")
    print(f"✅ {len(categories)} catégories")
    
    # 2. Logiciels
    print("\n→ Import des logiciels...")
    logiciels = data['logiciels']
    for log in logiciels:
        try:
            supabase.table('logiciels').insert({
                'id': log['id'],
                'categorie_id': log['categorie'],
                'nom_proprietaire': log['proprietaire']['nom'],
                'editeur': log['proprietaire']['editeur'],
                'description': log['proprietaire']['description'],
                'risques_lockin': log['proprietaire']['risques_lockin'],
                'url_officiel': log['proprietaire']['url_officiel'],
                'origine_pays': log['proprietaire']['origine_pays'],
                'modele_economique': log['proprietaire']['modele_economique'],
                'difficulte_migration': log['migration']['difficulte'],
                'score_lockin_technique': log['score_risque']['lockin_technique'],
                'score_lockin_donnees': log['score_risque']['lockin_donnees'],
                'score_lockin_financier': log['score_risque']['lockin_financier'],
                'score_dependance_ecosysteme': log['score_risque']['dependance_ecosysteme'],
                'score_maturite_alternative': log['score_risque']['maturite_alternative']
            }).execute()
        except Exception as e:
            print(f"  ⚠️ Erreur logiciel {log['id']}: {e}")
    print(f"✅ {len(logiciels)} logiciels")
    
    # 3. Alternatives
    print("\n→ Import des alternatives...")
    total_alts = 0
    for log in logiciels:
        for alt in log['alternatives_oss']:
            try:
                supabase.table('alternatives').insert({
                    'logiciel_id': log['id'],
                    'nom': alt['nom'],
                    'licence': alt['licence'],
                    'maturite': alt['maturite'],
                    'communaute': alt['communaute'],
                    'pays_origine': alt['pays_origine'],
                    'compatibilite_formats': alt['compatibilite_formats'],
                    'fonctionnalites_cles': alt['fonctionnalites_cles'],
                    'support_commercial': alt['support_commercial'],
                    'url': alt['url']
                }).execute()
                total_alts += 1
            except Exception as e:
                print(f"  ⚠️ Erreur alternative {alt['nom']}: {e}")
    print(f"✅ {total_alts} alternatives")
    
    print("\n🎉 IMPORT TERMINÉ !")

if __name__ == "__main__":
    main()