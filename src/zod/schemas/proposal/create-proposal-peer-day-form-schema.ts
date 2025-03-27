import { z } from "zod";
import moment from "moment";
import Toast from "react-native-simple-toast";

export const createProposaPerDaylRequestchema = z.object({
    completeClientName: z.string({
        required_error: 'Este campo é obrigatório!',
    }),
    userId: z.string({
        required_error: 'Este campo é obrigatório!',
    }),
    startDay: z.string({
        required_error: 'Este campo é obrigatório!',
    }),
    endDay: z.string({
        required_error: 'Este campo é obrigatório!',
    }),
    venueId: z.string({
        required_error: 'Este campo é obrigatório!',
    }),
    endHour: z.string({
        required_error: 'Este campo é obrigatório!',
    }),
    whatsapp: z.string({
        required_error: 'Este campo é obrigatório!',
    }),
    startHour: z.string({
        required_error: 'Este campo é obrigatório!',
    }),
    guestNumber: z.string({
        required_error: 'Este campo é obrigatório!',
    }),
    description: z.string({
        required_error: 'Este campo é obrigatório!',
    }),
    knowsVenue: z.boolean({
        required_error: 'Este campo é obrigatório!',
    }),
    email: z.string({
        required_error: 'Este campo é obrigatório!',
    }).email(),
    serviceIds: z.array(z.string()).optional(),
    totalAmountInput: z.string().optional(),
    type: z.enum(["EVENT", "OTHER", "BARTER", "PRODUCTION"]),
    trafficSource: z.enum(["AIRBNB", "GOOGLE", "INSTAGRAM", "TIKTOK", "OTHER", "FRIEND", "FACEBOOK"])
}).refine((data) => {
    const start = moment(data.startDay, "YYYY-MM-DD", true);
    const end = moment(data.endDay, "YYYY-MM-DD", true);
    const validation = start.isValid() && end.isValid() && start.isSameOrBefore(end);

    if (validation) {
        Toast.show("A data de início não pode ser depois da data de término!" as string, 3000, {
            backgroundColor: "rgb(75,181,67)",
            textColor: "white",
        });
    }
    return validation
}, {
    message: "A data de início não pode ser depois da data de término!",
    path: ["startDay"],
});

export type CreateProposaPerDaylRequestchema = z.infer<typeof createProposaPerDaylRequestchema>;