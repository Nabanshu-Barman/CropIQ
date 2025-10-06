"use client"

import { useEffect, useState } from "react"
import { TNDistrictNames } from "@/components/dashboard/crop-doctor/tn-districts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Location() {
  const [district, setDistrict] = useState<string>("")

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("userDistrict") : null
    if (saved) setDistrict(saved)
  }, [])

  const save = () => {
    if (!district) return
    localStorage.setItem("userDistrict", district)
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Choose Your District (Tamil Nadu)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-2">District</label>
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your district" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {TNDistrictNames.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button onClick={save} disabled={!district}>Save Location</Button>
          {district && <span className="text-sm text-muted-foreground self-center">Saved as: {district}</span>}
        </div>
        <p className="text-sm text-muted-foreground">
          Note: Manual district selection only.
        </p>
      </CardContent>
    </Card>
  )
}