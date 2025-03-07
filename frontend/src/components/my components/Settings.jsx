import React from 'react'
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <>
  <div className='px-8 pt-2 pb-2 h-full'>
  <Tabs defaultValue="password" className="w-full h-2/3">
    <TabsList>
      <TabsTrigger value="password">Changer Mot de passe</TabsTrigger>
    </TabsList>
    <TabsContent className="h-full" value='password'>
    <Card>
          <CardHeader>
            <CardTitle>Mot de passe</CardTitle>
            <CardDescription>
              Changez votre mot de passe. La modification sera prise en considération dans la prochaine connexion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 w-1/2">
            <div className="space-y-1">
              <Label htmlFor="current">Mot de passe actuel </Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">Nouveau mot de passe</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className='bg-yellow hover:bg-yellow-hover'>Enregistrer</Button>
          </CardFooter>
        </Card>
    </TabsContent>
    </Tabs>
    </div>
    </>
  )
}

export default Settings