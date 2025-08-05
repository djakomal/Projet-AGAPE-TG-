# 🔧 Guide de résolution des problèmes - CDEJ

## 🚨 Problème: Écran bleu au lieu du login

### ✅ Corrections appliquées

1. **Import Bootstrap corrigé**
   - ❌ Problème: Bootstrap importé deux fois (angular.json + styles.css)
   - ✅ Solution: Suppression de l'import redondant dans styles.css

2. **Font Awesome ajouté**
   - ❌ Problème: Icônes fa-eye manquantes dans le login
   - ✅ Solution: Ajout du CDN Font Awesome dans index.html

3. **Erreurs TypeScript corrigées**
   - ❌ Problème: Conflit de nom `CommonModule` 
   - ✅ Solution: Renommage en `CommonComponentsModule`
   - ❌ Problème: Import incorrect dans auth.service.spec.ts
   - ✅ Solution: Correction du chemin d'import

### 🎯 Étapes de débogage

1. **Vérifier la compilation**
   ```bash
   npx tsc --noEmit
   ```

2. **Tester la compilation Angular**
   ```bash
   node test-compilation.js
   ```

3. **Lancer le serveur de développement**
   ```bash
   ng serve --port 4200 --host 0.0.0.0
   ```

4. **Tester la page de debug**
   - Ouvrir `debug-app.html` dans un navigateur
   - Vérifier que les styles et scripts se chargent correctement

### 🔍 Diagnostics possibles

#### Si l'écran bleu persiste:

1. **Ouvrir la console du navigateur (F12)**
   - Rechercher les erreurs JavaScript
   - Vérifier les erreurs 404 (ressources manquantes)

2. **Vérifier le routing**
   - L'URL devrait rediriger vers `/login` automatiquement
   - Vérifier que le guard d'authentification fonctionne

3. **Tester les comptes de test**
   - **Coordinateur**: `coordinateur@cdej.com` / `coord123`
   - **Agent Social**: `social@cdej.com` / `social123`
   - **Agent Médical**: `medical@cdej.com` / `medical123`
   - **Comptable**: `comptable@cdej.com` / `comptable123`

### 📁 Structure attendue après login

```
Dashboard
├── Header (avec profil utilisateur)
├── Sidebar (navigation selon le rôle)
└── Contenu principal (selon la route)
```

### 🎨 Problèmes de styles courants

1. **CSS Variables non définies**
   - Vérifier que `styles.css` charge correctement
   - Variables principales: `--primary-blue`, `--white`, etc.

2. **Bootstrap non chargé**
   - Vérifier `angular.json` ligne 29
   - Ou ajouter manuellement le CDN dans `index.html`

3. **Icônes manquantes**
   - Bootstrap Icons: déjà inclus
   - Font Awesome: ajouté dans `index.html`

### 🚀 Redémarrage complet

```bash
# Nettoyer
npm run ng cache clean
rm -rf node_modules package-lock.json
npm install

# Reconstruire
ng build --configuration development

# Relancer
ng serve
```

### 📞 Support

Si le problème persiste après ces étapes:
1. Vérifier les logs du serveur
2. Tester avec un autre navigateur
3. Vérifier les permissions de fichiers
4. Consulter la console développeur pour plus de détails

---
*Guide créé pour le projet AGAPE-TG / CDEJ*