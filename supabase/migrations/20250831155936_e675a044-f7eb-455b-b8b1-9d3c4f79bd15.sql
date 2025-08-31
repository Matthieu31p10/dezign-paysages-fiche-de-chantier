-- Supprimer les anciennes politiques restrictives pour la table personnel
DROP POLICY IF EXISTS "Only admins can manage personnel" ON personnel;
DROP POLICY IF EXISTS "Only admins can view personnel data" ON personnel;

-- Créer de nouvelles politiques permettant à tous les utilisateurs authentifiés de gérer le personnel
CREATE POLICY "Authenticated users can view personnel" 
ON personnel 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert personnel" 
ON personnel 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update personnel" 
ON personnel 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete personnel" 
ON personnel 
FOR DELETE 
TO authenticated
USING (true);