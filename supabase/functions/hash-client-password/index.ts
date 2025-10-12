import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, password, action } = await req.json()

    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    if (action === 'create' || action === 'update') {
      // Hash the password
      const passwordHash = await bcrypt.hash(password)

      // Update or insert the client connection with hashed password
      const { data, error } = await supabaseClient
        .from('client_connections')
        .upsert({
          email,
          password_hash: passwordHash,
          password: password, // Keep old column for backward compatibility temporarily
        }, {
          onConflict: 'email'
        })
        .select()
        .single()

      if (error) throw error

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Password hashed successfully',
          client_id: data.id 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else if (action === 'verify') {
      // Verify password
      const { data, error } = await supabaseClient
        .from('client_connections')
        .select('password_hash, password')
        .eq('email', email)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        return new Response(
          JSON.stringify({ success: false, message: 'Client not found or inactive' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401 
          }
        )
      }

      // Try new hash first, fall back to plaintext comparison
      let isValid = false
      if (data.password_hash) {
        isValid = await bcrypt.compare(password, data.password_hash)
      } else if (data.password) {
        // Fallback for unmigrated passwords
        isValid = password === data.password
      }

      return new Response(
        JSON.stringify({ 
          success: isValid,
          message: isValid ? 'Authentication successful' : 'Invalid credentials'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: isValid ? 200 : 401 
        }
      )
    } else {
      throw new Error('Invalid action. Use "create", "update", or "verify"')
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
