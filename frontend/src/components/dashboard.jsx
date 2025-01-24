import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'


const orderData = [
    { name: 'Delivered', value: 60 },
    { name: 'Takeout', value: 25 },
    { name: 'At Place', value: 15 },
  ]
  
const COLORS = ['#790117', '#F7B336', '#DB7C24']

const Dashboard = () => {
  return (
    <>
    <main className="flex-1 overflow-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Bienvenue, User_name</h1>
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
        </div>

        {/* Daily Summary */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Résumé quotidien</h2>
          <div className="grid grid-cols-4 gap-6">
            {/* Orders Card */}
            <Card className="bg-[#F7B336] rounded-xl">
              <CardContent className="p-6">
                <div className="text-4xl font-bold">15</div>
                <div className="text-lg">Commandes</div>
              </CardContent>
            </Card>

            {/* Revenue Card */}
            <Card className="overflow-hidden rounded-xl">
              <CardContent className="p-0 h-full">
                <div className="p-6 bg-gradient-to-r from-[#790117] to-[#F7B336] text-white h-full">
                  <div className="text-4xl font-bold">500$</div>
                  <div className="text-lg">Revenue</div>
                </div>
              </CardContent>
            </Card>

            {/* Reservations Card */}
            <Card className="bg-[#DB7C24] text-white rounded-xl">
              <CardContent className="p-6">
                <div className="text-4xl font-bold">10</div>
                <div className="text-lg">Réservations</div>
              </CardContent>
            </Card>

            {/* Pending Repairs Card */}
            <Card className="bg-[#790117] text-white rounded-xl">
              <CardContent className="p-6">
                <div className="text-4xl font-bold">3</div>
                <div className="text-lg">Réparations en Attente</div>
              </CardContent>
            </Card>
          </div>
        </div>

        
        <div className="grid grid-cols-12 gap-6">
          {/* Pie Chart **/}
          <Card className="col-span-6 rounded-xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Pie chart of types of orders</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {orderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Right Side Stats */}
          <div className="col-span-6 space-y-6">
            {/* Average Customers */}
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Moyenne des clients</h3>
                <div className="text-4xl font-bold">40</div>
                <div className="text-sm text-gray-500">Par jour</div>
              </CardContent>
            </Card>

            {/* Most Ordered Dishes */}
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Plats les plus commandés :</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-lg">+ Plat 1</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg">+ Plat 1</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg">+ Plat 1</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </main>
    </>
  )
}

export default Dashboard