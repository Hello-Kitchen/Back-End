# Documentation de Sécurité - API HelloKitchen

## Table des matières
1. [Architecture de Sécurité](#1-architecture-de-sécurité)
2. [Authentification](#2-authentification)
3. [Protection des Données](#3-protection-des-données)
4. [Tests de Sécurité](#4-tests-de-sécurité)
5. [Recommandations](#5-recommandations)

## 1. Architecture de Sécurité

### 1.1 Vue d'ensemble
L'API HelloKitchen utilise une architecture sécurisée basée sur NestJS avec plusieurs couches de protection :

- Validation globale des entrées
- Protection contre les attaques courantes avec Helmet
- Rate limiting pour prévenir les attaques par force brute
- JWT pour l'authentification

```typescript
const app = await NestFactory.create(AppModule, { abortOnError: false });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove undefined properties in the DTO
      forbidNonWhitelisted: true, // Throw an error if undefined properties are present
      transform: true, // Transform the values according to the type specified in the DTO
    }),
  );
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 min
      max: 100, // IP Limit
    }),
  );
```

### 1.2 Middlewares de Sécurité
L'application implémente plusieurs middlewares de sécurité essentiels :

- **Helmet** : Protection des en-têtes HTTP
- **Rate Limiting** : 100 requêtes par IP sur 15 minutes
- **Validation Pipe** : Nettoyage et validation des données entrantes

## 2. Authentification

### 2.1 Système de Login
Le système d'authentification est géré par le module de login :

```typescript
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' }, // life of the token
      secret: 'secret',
    }),
  ],
  controllers: [
    LoginController /**< The controller responsible for handling HTTP requests related to login items */,
  ],
  providers: [
    LoginService /**< The service that contains the business logic for managing login items */,
    JwtStrategy,
  ],
  exports: [JwtModule, PassportModule],
})
```

### 2.2 Protection JWT
La stratégie JWT est configurée pour une sécurité maximale :

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
  }
}
```

### 2.3 Guard d'Authentification
Le guard JWT protège les routes sensibles :

```typescript
@Injectable()
export class AuthGuard extends AuthGuard('jwt') {}
```

## 3. Protection des Données

### 3.1 Schéma Utilisateur
Le modèle de données utilisateur définit la structure sécurisée :

```typescript
@Prop({
    type: Number,
    required: true,
    description: 'Doit être un entier et est obligatoire',
  })
  id: number;

  @Prop({ type: Number, required: true, description: 'Doit être un entier' })
  id_restaurant: number;

  @Prop({
    type: String,
    required: true,
    description: 'Doit être une chaîne de caractères',
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    description: 'Doit être une chaîne de caractères',
  })
  password: string;
```

### 3.2 Validation des Requêtes
Exemple de validation dans le contrôleur de restaurant :

```typescript
@Post()
@UseGuards(AuthGuard)
@UsePipes(ValidationPipe)
```

## 4. Tests de Sécurité

### 4.1 Tests d'Authentification
Les tests vérifient la sécurité du processus d'authentification :

```typescript
describe('login', () => {
    const loginCredentials = {
      username: 'testuser',
      password: 'testpass',
      idRestaurant: 1,
    };

    const mockUser = {
      id: 1,
      username: 'testuser',
      role: 'user',
    };

    const mockToken = {
      access_token: 'mock.jwt.token',
    };

    it('should successfully authenticate and return a token', async () => {
      mockLoginService.authenticateUser.mockResolvedValue(mockUser);
      mockLoginService.login.mockResolvedValue(mockToken);

      const result = await controller.login(
        loginCredentials.password,
        loginCredentials.username,
        loginCredentials.idRestaurant,
      );

      expect(mockLoginService.authenticateUser).toHaveBeenCalledWith(
        loginCredentials.idRestaurant,
        loginCredentials.username,
        loginCredentials.password,
      );

      expect(mockLoginService.login).toHaveBeenCalledWith(mockUser);

      expect(result).toEqual(mockToken);
    });

    it('should throw BadRequestException when authentication fails', async () => {
      mockLoginService.authenticateUser.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(
        controller.login(
          loginCredentials.password,
          loginCredentials.username,
          loginCredentials.idRestaurant,
        ),
      ).rejects.toThrow(BadRequestException);
    });
```

## 5. Recommandations

### 5.1 Améliorations Prioritaires

1. **Sécurisation des Secrets**
   - Déplacer les secrets vers des variables d'environnement
   - Utiliser un gestionnaire de secrets (ex: Vault)

2. **Renforcement de l'Authentification**
   - Implémenter le hachage des mots de passe
   - Ajouter un système de refresh tokens
   - Mettre en place une politique de mots de passe forts

3. **Logging et Monitoring**
   - Implémenter un système de logging sécurisé
   - Mettre en place une surveillance des tentatives d'authentification
   - Configurer des alertes de sécurité

### 5.2 Configuration Recommandée

Ajouter dans le fichier `.env` :

```
JWT_SECRET=votre_secret_complexe
JWT_EXPIRATION=3600
MONGODB_URI=votre_uri_mongodb
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

### 5.3 Bonnes Pratiques de Développement

1. **Validation des Données**
   - Utiliser systématiquement les DTOs
   - Valider toutes les entrées utilisateur
   - Échapper les données sensibles

2. **Gestion des Erreurs**
   - Ne pas exposer les détails techniques dans les messages d'erreur
   - Logger les erreurs de sécurité
   - Implémenter une gestion centralisée des erreurs

3. **Tests**
   - Maintenir une couverture de tests élevée
   - Inclure des tests de sécurité
   - Tester les cas d'erreur

## Conclusion

Cette documentation de sécurité doit être régulièrement mise à jour et partagée avec l'équipe de développement. Les recommandations doivent être implémentées selon leur priorité pour maintenir un niveau de sécurité optimal.